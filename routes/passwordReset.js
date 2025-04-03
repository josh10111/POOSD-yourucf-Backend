const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();

// Request password reset
router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({ message: 'User does not exist' });
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id.toString() }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);
    
    res.status(200).json({ message: 'Check your email to receive a password reset link.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Hash new password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user's password
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password successfully updated. You can now log in with your new password.' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired token. Please request a new password reset link.' });
    }
    
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;