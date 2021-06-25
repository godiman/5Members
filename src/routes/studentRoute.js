const express = require('express');

const route = express.Router();

const studentCon = require('../controllers/studentController');

const {validate_token} = require('../helper/validator');

route.get('/student-dashboard', validate_token, studentCon.home);

route.get('/setting', validate_token, studentCon.settings);

route.get('/read-notice', validate_token, studentCon.get_notice);

route.post('/change-password', validate_token, studentCon.changePassword);

route.post('/student-appointment', validate_token, studentCon.appointment);

route.get('/view-reply', validate_token, studentCon.viewReply);

module.exports = route;