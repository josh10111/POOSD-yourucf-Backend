const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const { createToken, isExpired, refreshToken } = require('./createJWT');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ Email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    const userId = await generateUserId();

    // Create new user
    user = new User({
      userId,
      FirstName,
      LastName,
      Email,
      Password: hashedPassword,
    });

    await user.save();

    // Create JWT
    const token = createToken(user._id);

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Check if user exists
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT
    const token = createToken(user._id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const generateUserId = async () => {
  const lastUser = await User.findOne().sort({ userId: -1 });
  if (!lastUser) {
    return 1;
  }
    return lastUser.userId + 1;
};

module.exports = router;