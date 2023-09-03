const express = require('express');
const {
  category: Category,
  category_field,
  field_type,
  option,
  sequelize,
} = require('../database/database');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all categories with a specific parent ID
router.get('/child-of/:parentId', async (req, res) => {
  try {
    const childCategories = await Category.findAll({
      where: {
        parent_id: req.params.parentId,
      },
      include: [
        {
          model: category_field,
          as: 'category_fields',
          include: [
            {
              model: field_type,
              as: 'field_type',
            },
            {
              model: option,
              as: 'options',
            },
          ],
        },
      ],
    });

    res.status(200).json(childCategories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all top-level categories (categories without a parent ID)
router.get('/top-level', async (req, res) => {
  try {
    const topLevelCategories = await Category.findAll({
      where: {
        parent_id: null,
      },
      include: [
        {
          model: category_field,
          as: 'category_fields',
          include: [
            {
              model: field_type,
              as: 'field_type',
            },
            {
              model: option,
              as: 'options',
            },
          ],
        },
      ],
    });
    res.status(200).json(topLevelCategories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Function to recursively get parent fields
async function getParentFields(categoryId, fields = []) {
  const category = await Category.findByPk(categoryId, {
    include: [
      {
        model: category_field,
        as: 'category_fields',
        include: [
          {
            model: field_type,
            as: 'field_type',
          },
          {
            model: option,
            as: 'options',
          },
        ],
      },
    ],
  });

  if (category) {
    fields.push(...category.category_fields);

    if (category.parent_id) {
      fields = await getParentFields(category.parent_id, fields);
    }
  }

  return fields;
}

// Get a category by ID, including parent fields
router.get('/:id', async (req, res) => {
  try {
    const categoryByPk = await Category.findByPk(req.params.id, {
      include: [
        {
          model: category_field,
          as: 'category_fields',
          include: [
            {
              model: field_type,
              as: 'field_type',
            },
            {
              model: option,
              as: 'options',
            },
          ],
        },
      ],
    });

    if (categoryByPk) {
      const parentFields = await getParentFields(categoryByPk.parent_id);
      categoryByPk.dataValues.parent_fields = parentFields;
      res.send(categoryByPk);
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  // Extract fields from request body
  const { title, description, parent_id, image, category_fields } = req.body;

  // Ensure required fields are present
  if (!title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Start a new transaction
  const t = await sequelize.transaction();

  try {
    // Create the category
    const newCategory = await Category.create(
      {
        title,
        description,
        parent_id,
        image,
      },
      { transaction: t }
    );

    // Check if category fields are provided
    if (category_fields && category_fields.length > 0) {
      const createdFields = [];

      // Loop through each category field
      for (const field of category_fields) {
        const { field_name, field_type_id, options } = field;

        // Fetch the field type
        const fieldType = await field_type.findByPk(field_type_id);

        // Create the category field
        const createdField = await category_field.create(
          {
            category_id: newCategory.id,
            field_name: field_name,
            field_type_id: field_type_id,
          },
          { transaction: t }
        );

        // If the field is a select and has options, create the options
        if (
          (fieldType.name === 'select' || fieldType.name === 'multi-select') &&
          options &&
          options.length > 0
        ) {
          const createdOptions = [];

          // Loop through each option
          for (const optionName of options) {
            // Create the option
            const createdOption = await option.create(
              {
                category_field_id: createdField.id,
                name: optionName,
              },
              { transaction: t }
            );

            createdOptions.push(createdOption);
          }

          // Add the created options to the created field
          createdField.options = createdOptions;
        }

        createdFields.push(createdField);
      }

      // Add the created fields to the category object
      newCategory.category_fields = createdFields;
    }

    // Commit the transaction
    await t.commit();

    // Send response
    res.status(201).json(newCategory);
  } catch (err) {
    // Rollback the transaction in case of any errors
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
});

// Update a category by ID
router.put('/:id', async (req, res) => {
  const {
    title,
    description,
    parent_id,
    updateFields,
    deleteFields,
    newFields,
  } = req.body;

  // Begin a transaction
  const t = await sequelize.transaction();

  try {
    const categoryToUpdate = await Category.findByPk(
      req.params.id,
      {
        include: {
          model: category_field,
          as: 'category_fields',
          include: [
            {
              model: field_type,
              as: 'field_type',
            },
            {
              model: option,
              as: 'options',
            },
          ],
        },
      },
      { transaction: t }
    );

    if (!categoryToUpdate) {
      return res.status(404).send({ message: 'Category not found' });
    }

    if (title) {
      categoryToUpdate.title = title;
    }

    if (description !== undefined) {
      categoryToUpdate.description = description;
    }

    if (parent_id) {
      const parentCategory = await Category.findByPk(parent_id, {
        transaction: t,
      });

      if (!parentCategory) {
        return res.status(404).send({ message: 'Parent category not found' });
      }

      categoryToUpdate.parent_id = parent_id;
    }

    // Update category fields
    if (Array.isArray(updateFields)) {
      for (let field of updateFields) {
        const existingField = categoryToUpdate.category_fields.find(
          (f) => f.id === field.id
        );

        if (existingField) {
          existingField.field_name = field.field_name;
          existingField.field_type_id = field.field_type_id;
          await existingField.save({ transaction: t });
        }
      }
    }

    // Delete category fields
    if (Array.isArray(deleteFields)) {
      for (let fieldId of deleteFields) {
        const existingField = categoryToUpdate.category_fields.find(
          (f) => f.id === fieldId
        );

        if (existingField) {
          await existingField.destroy({ transaction: t });
        }
      }
    }

    // Create new category fields
    if (Array.isArray(newFields)) {
      for (let field of newFields) {
        await category_field.create(
          {
            category_id: categoryToUpdate.id,
            field_name: field.field_name,
            field_type_id: field.field_type_id,
          },
          { transaction: t }
        );
      }
    }

    await categoryToUpdate.save({ transaction: t });

    // Commit the transaction
    await t.commit();

    res.send(categoryToUpdate);
  } catch (err) {
    // If there's an error, rollback the transaction
    await t.rollback();

    res.status(500).send({ message: err.message });
  }
});

// Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({
      where: { id: req.params.id },
    });
    if (deletedCategory === 1) {
      res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
