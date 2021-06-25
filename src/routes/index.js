// import express
const express = require('express');

// import route
const route = express.Router();

// Import controller
const homeController = require('../controllers/index');

route.get('/', homeController.index);

route.get('/event', homeController.event);

route.post('/register', homeController.register);

route.post('/auth', homeController.auth);

route.get('/logout', homeController.get_logout);

module.exports = route;