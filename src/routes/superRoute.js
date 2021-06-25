
const express = require('express');

// import admin controller
const adminCon = require('../controllers/adminController');

const noticeFile = require('../helper/fileHandler');

const {validate_token, isAdmin} = require('../helper/validator');

const route = express.Router();

route.get('/admin-dashboard', validate_token, isAdmin, adminCon.adminHome);

route.get('/admin-notice', validate_token, isAdmin, adminCon.adminNotice);

route.post('/student-notice', validate_token, isAdmin, noticeFile, adminCon.studentNotice);

route.post('/lecturer-notice', validate_token,isAdmin, noticeFile, adminCon.lectNotice);

route.get('/admin-setting', validate_token, isAdmin, adminCon.adminSetting);

route.post('/update-password', validate_token, isAdmin, adminCon.updatePassword);

route.post('/create-admin', validate_token, isAdmin, adminCon.createAdmin);

route.get('/register-lecturer', adminCon.registerAdmin);

module.exports = route;