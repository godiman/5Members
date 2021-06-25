const express = require('express');

const route = express.Router();

const lectCon = require('../controllers/lecturerController');
const {validate_token, isLecturer} = require('../helper/validator');

route.get('/lecturer-dashboard', validate_token, isLecturer, lectCon.get_home);

route.get('/lect-read-notice', validate_token, isLecturer, lectCon.get_notice);

route.get('/view-appointment', validate_token, isLecturer, lectCon.get_appointment);

route.get('/reply-student', validate_token, isLecturer, lectCon.reply);

route.post('/post-reply', validate_token, isLecturer, lectCon.postReply);

route.post('/lect-account', lectCon.lectAccount);

module.exports = route;