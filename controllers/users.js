const usersRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/config');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({
      error: 'username is required and should be min of 3 characters',
    });
  }

  if (!password || password.length < 3) {
    return res.status(400).json({
      error: 'password is required and should be min of 3 characters',
    });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
  }
});

module.exports = usersRouter;
