const express = require('express');
const router = express.Router();
const {
  user_filter,
  category,
  category_field,
  field_type,
  option,
} = require('../database/database');
const auth = require('../helper/authHelper');

// Save a filter configuration
router.post('/save-filter', auth, async (req, res) => {
  const { category_id, filter } = req.body;
  const user_id = req.user.userId;

  try {
    const userFilter = await user_filter.create({
      user_id,
      category_id,
      filter: JSON.stringify(filter),
    });
    res.status(201).json(userFilter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all filter configurations for a user
router.get('/get-my-filters/', auth, async (req, res) => {
  const user_id = req.user.userId;

  try {
    const filters = await user_filter.findAll({
      where: { user_id },
      include: [
        {
          model: category,
          as: 'category',
          
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
            {
              model: category,
              as: 'parent',
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
            },
          ],
        },
      ],
    });

    res.status(200).json(filters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a filter by ID
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { filter } = req.body;

  try {
    const existingFilter = await user_filter.findByPk(id);

    if (!existingFilter) {
      return res.status(404).json({ error: 'Filter not found' });
    }

    existingFilter.filter = JSON.stringify(filter);

    await existingFilter.save();

    res.json({ message: 'Filter updated', filter: existingFilter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new filter
router.post('/', async (req, res) => {
  const { user_id, category_id, filter } = req.body;

  try {
    const newFilter = await user_filter.create({
      user_id,
      category_id,
      filter,
    });
    res.status(201).json(newFilter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all filters
router.get('/', async (req, res) => {
  try {
    const filters = await user_filter.findAll();
    res.status(200).json(filters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a filter by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const filter = await user_filter.findByPk(id);

    if (!filter) {
      return res.status(404).json({ error: 'Filter not found' });
    }

    res.json(filter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a filter
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existingFilter = await user_filter.findByPk(id);

    if (!existingFilter) {
      return res.status(404).json({ error: 'Filter not found' });
    }

    await existingFilter.destroy();

    res.json({ message: 'Filter deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
