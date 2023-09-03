const express = require('express');
const { user: User } = require('../database/database');

const router = express.Router();
const bcrypt = require('bcrypt');
const RoleEnum = require('../enums/roles.enum');

// Get all users

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post('/', async (req, res, next) => {
  // Validate the request body here
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Missing email or password');
  }

  try {
    // Check if a user with the given email already exists
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).send('User with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(RoleEnum);
    // Create new user
    user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      role_id: RoleEnum.USER,
    });

    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await User.update(req.body);
      res.status(200).json({ message: 'User updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await User.destroy();
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
