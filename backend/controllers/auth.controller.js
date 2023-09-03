const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { user: User } = require('../database/database');
const RoleEnum = require('../enums/roles.enum');

// Secret for JWT
const JWT_SECRET = 'your_jwt_secret'; // This should ideally be in a .env file and not hard-coded.

// Registration
router.post('/register', async (req, res, next) => {
  // Validate the request body here
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(400).send('Missing fields');
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).send('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user
    user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      role_id: RoleEnum.USER,
    });

    // Create a token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    // Send token to the user
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  // Validate request body
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Missing fields');
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).send('No user with that email');
    }

    // Check password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }

    // Create a token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
      },
      JWT_SECRET
    );

    // Send token to the user
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
