const express = require('express');
const router = express.Router();
const {
  post: Post,
  post_field_value: PostFieldValue,
  category_field,
  user_filter,
  sequelize,
  option,
  category,
} = require('../database/database');
const FieldTypeEnum = require('../enums/field_types.enum');
const auth = require('../helper/authHelper');
const { Op, and } = require('sequelize');
const AWS = require('aws-sdk');
require('dotenv').config();

const sqs = new AWS.SQS({ region: 'us-east-1' });

const sendSQS = (data) => {
  if (!process.env.SQS_URL) {
    console.error('SQS_URL not defined');
    return;
  }

  const params = {
    MessageBody: JSON.stringify(data),
    QueueUrl: process.env.SQS_URL,
  };

  sqs.sendMessage(params, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result, params);
  });
};

const fieldConditionMap = (value, min_value, max_value) => ({
  [FieldTypeEnum.TEXT]: ` AND value ILIKE '%${value}%'`,
  [FieldTypeEnum.NUMBER]:
    min_value && max_value
      ? ` AND value::integer BETWEEN ${min_value} AND ${max_value}`
      : min_value
      ? ` AND value::integer >= ${min_value}`
      : ` AND value::integer <= ${max_value}`,
  [FieldTypeEnum.DATE]:
    min_value && max_value
      ? ` AND value::date BETWEEN '${min_value}' AND '${max_value}'`
      : min_value
      ? ` AND value::date >= '${min_value}'`
      : ` AND value::date <= '${max_value}'`,
  [FieldTypeEnum.SELECT]: ` AND value = '${value}'`,
  [FieldTypeEnum.MULTI_SELECT]: ` AND value = '${value}'`,
  [FieldTypeEnum.BOOLEAN]: ` AND value = '${value}'`,
});

const buildAndConditions = (category_fields) => {
  const conditions = [];

  category_fields.forEach((field) => {
    const { filter, category_fields_id } = field;
    const { value, min_value, max_value } = filter;
    let condition = `category_field_id = ${category_fields_id}`;

    condition += fieldConditionMap(value, min_value, max_value)[
      field.field_type_id
    ];

    conditions.push({
      [Op.in]: sequelize.literal(
        `(SELECT post_id FROM post_field_value WHERE ${condition})`
      ),
    });
  });

  return conditions;
};

const search = async (req, res) => {
  try {
    const {
      category_id,
      title,
      category_fields,
      content,
      user_id,
      post_id,
      filterId,
    } = req.body;

    let whereClause = {
      ...(category_id && { category_id }),
      ...(user_id && { user_id }),
      ...(title && { title: { [Op.iLike]: `%${title}%` } }),
      ...(post_id && { id: post_id }),
      ...(content && { content: { [Op.iLike]: `%${content}%` } }),
      ...(category_fields?.length && {
        id: { [Op.and]: buildAndConditions(category_fields) },
      }),
    };

    const posts = await Post.findAll({
      where: whereClause,
      include: [
        {
          model: PostFieldValue,
          as: 'post_field_values',
          required: false,
          include: [
            {
              model: category_field,
              as: 'category_field',
              include: [
                {
                  model: option,
                  as: 'options',
                },
              ],
            },
          ],
        },
        {
          model: category,
          as: 'category',
        },
      ],
    });

    posts.forEach((post) => {
      (post?.post_field_values || []).forEach((field) => {
        if (field.category_field.field_type_id === FieldTypeEnum.SELECT) {
          field.value = field.category_field.options.find(
            (option) => option.id == field.value
          ).name;
        }
      });
      if (filterId) {
        post.dataValues.filterId = filterId;
      }
    });

    return posts;
  } catch (err) {
    console.error(err);
    return [];
  }
};

router.post('/sqs', async (req, res) => {
  // const { title, content, user_id, category_id, post_fields } = req.body;
  try {
    sendSQS({ ...req.body });
    res.status(200).json('message sent');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/search', async (req, res) => {
  try {
    const posts = await search(req);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/get-user-posts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Get all filters for the user
    const filters = await user_filter.findAll({
      where: { user_id: userId },
      include: [
        {
          model: category,
          as: 'category',
        },
      ],
    });

    if (!filters) {
      return res.status(404).json({ error: 'No filters found for this user' });
    }

    // For each filter, get the posts that match the filter
    let allPosts = [];

    for (let filter of filters) {
      const parsedFilter = JSON.parse(filter.filter);

      req.body = {
        category_id: filter.category_id,
        category_fields: parsedFilter.category_fields,
        title: parsedFilter.title,
        content: parsedFilter.content,
        filterId: filter.id,
      };

      // Call your existing search method and add the posts to the allPosts array
      const posts = await search(req);

      allPosts = [...allPosts, ...posts];
    }

    res.status(200).json({ posts: allPosts, filters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a post by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post
    const post = await Post.findByPk(id, {
      include: [
        {
          model: PostFieldValue,
          as: 'post_field_values',
          required: false,
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/// Create a new post
router.post('/', auth, async (req, res) => {
  const { title, content, category_id, post_fields } = req.body;
  const user_id = req.user.userId;
  // Begin a transaction
  const t = await sequelize.transaction();

  try {
    // Create the post
    const post = await Post.create(
      {
        title,
        content,
        user_id,
        category_id,
      },
      { transaction: t }
    );

    // Create the post field values
    if (post_fields) {
      const postFieldValues = post_fields.map((field) => ({
        post_id: post.id,
        category_field_id: field.category_field_id,
        value: field.value,
      }));

      await PostFieldValue.bulkCreate(postFieldValues, { transaction: t });
    }

    // Commit the transaction
    await t.commit();

    // Retrieve the full post object including the post_field_values
    const fullPost = await Post.findByPk(post.id, {
      include: [
        {
          model: PostFieldValue,
          as: 'post_field_values',
          required: false,
        },
      ],
    });

    sendSQS(fullPost);

    res.status(201).json(fullPost);
  } catch (error) {
    // If there's an error, rollback the transaction
    await t.rollback();

    res.status(400).json({ error: error.message });
  }
});

// Update post
router.put('/:id', async (req, res) => {
  const { title, content, user_id, category_id, post_fields } = req.body;

  // Begin a transaction
  const t = await sequelize.transaction();

  try {
    // Find the post
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Update the post
    await post.update(
      {
        title,
        content,
        user_id,
        category_id,
      },
      { transaction: t }
    );

    // Update the post field values
    if (post_fields) {
      for (let field of post_fields) {
        const existingField = await PostFieldValue.findOne({
          where: {
            post_id: post.id,
            category_field_id: field.category_field_id,
          },
        });

        if (existingField) {
          // Update existing field
          await existingField.update(
            { value: field.value },
            { transaction: t }
          );
        } else {
          // Create new field
          await PostFieldValue.create(
            {
              post_id: post.id,
              category_field_id: field.category_field_id,
              value: field.value,
            },
            { transaction: t }
          );
        }
      }
    }

    // Commit the transaction
    await t.commit();

    // Retrieve the full post object including the post_field_values
    const fullPost = await Post.findByPk(post.id, {
      include: [
        {
          model: PostFieldValue,
          as: 'post_field_values',
          required: false,
        },
      ],
    });

    res.status(200).json(fullPost);
  } catch (error) {
    // If there's an error, rollback the transaction
    await t.rollback();

    res.status(400).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post) {
      await post.destroy();
      res.status(200).json({ message: 'Post deleted.' });
    } else {
      res.status(404).json({ message: 'Post not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
