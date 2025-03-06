const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.isExpired = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return false; // Token is valid
  } catch (err) {
    return true; // Token is expired or invalid
  }
};

exports.refreshToken = (token) => {
  const decoded = jwt.decode(token);
  return jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};