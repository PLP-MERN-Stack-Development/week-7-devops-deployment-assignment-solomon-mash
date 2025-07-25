const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth'); 

// Admin-only: Get all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, 'username role');     res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

// Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role });
   const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  await user.save();
  res.status(201).json({ message: 'User registered', token });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role, username:user.username}, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ token });
});

module.exports = router;
