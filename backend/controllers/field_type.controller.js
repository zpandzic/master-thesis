const express = require('express');
const { field_type } = require('../database/database');
const router = express.Router();


// Get all field types
router.get('/', async (req, res) => {
  try {
    const fieldTypes = await field_type.findAll();
    res.json(fieldTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one field type
router.get('/:id', getFieldType, (req, res) => {
  res.json(res.fieldType);
});

// Create one field type
router.post('/', async (req, res) => {
  try {
    const fieldType = await field_type.create(req.body);
    res.status(201).json(fieldType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one field type
router.patch('/:id', getFieldType, async (req, res) => {
  try {
    const updatedFieldType = await res.fieldType.update(req.body);
    res.json(updatedFieldType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one field type
router.delete('/:id', getFieldType, async (req, res) => {
  try {
    await res.fieldType.destroy();
    res.json({ message: 'Deleted Field Type' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a field type by ID
async function getFieldType(req, res, next) {
  let fieldType;
  try {
    fieldType = await field_type.findByPk(req.params.id);
    if (fieldType == null) {
      return res.status(404).json({ message: 'Cannot find field type' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  
  res.fieldType = fieldType;
  next();
}

module.exports = router;
