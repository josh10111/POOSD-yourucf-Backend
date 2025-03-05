// api.js
const express = require('express');
const authRoutes = require('./routes/auth'); 

exports.setApp = function (app, client) {
    // Uses router
    app.use('/api/auth', authRoutes);  // This will handle route /api/auth/register and /api/auth/login
};
