
// import bcryptjs
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const accountService = require('../services/accountService');
const adminService = require('../services/adminService');
const studentService = require('../services/studentService');
const transport = require('../helper/senMail');

module.exports = {

    adminHome: (req, res) =>{
        res.render('superAdmin/home');
    },

    adminNotice: (req, res) =>{
        res.render('superAdmin/notice');
    },

    studentNotice: (req, res) =>{

        const body = req.body;

        const uni = req.user.uId;
        //console.log(uni);

        //console.log(body);
        // console.log(req.body);
        // console.log(req.file.filename);

        // English letters, spaces and the following symbols ' - . are allowed
        //const validInput = '^[a-zA-Z 0-9 /.-]*$';
        
        if (body.noticeTitle == '' || body.noticeDesc == '') {
            let err = 'Invalid input format..';
            return res.render('superAdmin/home', {error: err});
        }

        accountService.findU_i(uni, (e, d) =>{
            if (e) {
                return console.log(e);
            }
            const adminId = d[0].user_id;
            //console.log('Admin Id: ', adminId);

            const uploadNotice = req.file.filename;

            adminService.saveNotice(adminId, body, uploadNotice, (er, r) =>{
                if (er) {
                    return console.log(er);
                }
                let msg = 'Notice published successfully.'
                return res.render('superAdmin/home', {success: msg});
            })

        })
        
    },

    lectNotice: (req, res) =>{

        const body = req.body;

        const uni = req.user.uId;
        //console.log(uni);

        //console.log(body);
        // console.log(req.body);
        // console.log(req.file.filename);

        if (body.noticeTitle == '' || body.noticeDesc == '') {
            let err = 'Invalid input format..';
            return res.render('superAdmin/home', {error: err});
        }

        accountService.findU_i(uni, (e, d) =>{
            if (e) {
                return console.log(e);
            }
            const adminId = d[0].user_id;
            //console.log('Admin Id: ', adminId);

            const uploadNotice = req.file.filename;

            adminService.saveNotice(adminId, body, uploadNotice, (er, r) =>{
                if (er) {
                    return console.log(er);
                }
                //console.log(r);
                let msg = 'Notice published successfully.'
                return res.render('superAdmin/home', {success: msg});
            })

        })
        
    },

    adminSetting: (req, res) =>{
        
        const uni = req.user.uId;

        accountService.findU_i(uni, (e, r) =>{
            if (e) {
                return console.log(e);
            }
            res.render('superAdmin/settings', {u: r});
        })
        
    },

    updatePassword: (req, res) =>{

        const body = req.body;
        const uni = req.user.uId;

        if (body.oldPass === "" || body.newPass === "" || body.newPass.toString().trim() != body.confirmNew) {
            let err = "Password do not match";
            return res.render('superAdmin/settings', {error: err});
        }
        if (body.oldPass.toString().trim() == body.newPass) {
            let err = "Enter new password";
            return res.render('superAdmin/settings', {error: err});
        }
        
        // hash the new password
        //console.log(body.oldPass);

        accountService.findU_i(uni, async(er, p) =>{

            // compares the old password 
            if (! (await bcrypt.compare(body.oldPass, p[0].password))) {
                let err = "Incorrect password";
                return res.render('superAdmin/settings', {error: err});
            }
            const newPass = await bcrypt.hash(body.newPass, 8);
            //console.log(newPass);
            // Get user by unique id
            studentService.changePass(newPass, uni, (e, d) =>{
                if (e) {
                    return console.log(e);
                }
                //return console.log(d);
                let msg = 'Changes applied successfully'
                return res.render('superAdmin/settings', {success: msg});
            })
        })

    },

    createAdmin: (req, res) =>{

        // console.log(req.body);
        const body = req.body;

        const userId = req.user.uId;
        //console.log(userId);

        if (!body.email){
            let err = "Email address is required";
            return res.render('superAdmin/home', {error: err});
        }
        
        //console.log(body);

        // Generate random numbers in the range 0, 9000
        let otp_code = Math.floor(1000 + Math. random() * 9000);

        // insert the otp to the db
        adminService.createOtp(userId, body.email, body.role, otp_code, (er, u) =>{
            if (er) {
                return console.log(er);
            }
            
            const mailOptions = {
                from: process.env.USER,
                to: body.email,
                subject: 'School Info Registration',
                text:'Click on the link below to complete your registration',
                html: 'School info has invited you to create your account.'+ '<br/>'+ '<strong style="color: #FF5722;">Your Verification token: ' + otp_code +'</strong>'+ '<br>' + 'The link will expired after 30 seconds.' + '<br/>' + '<a href="http://localhost:5000/register-lecturer">Click here to register</a>'
            }
    
            // send the email and return either success or error msg
            transport.sendMail(mailOptions, (error, r) =>{
                if (error) {
                    console.log(error.message);
                    let err = "Connction timeout..";
                    return res.render('superAdmin/home', {error: err});
                }
                let msg = "Link has been sent..";
                return res.render('superAdmin/home', {success: msg});
    
            })
        } )
        
    },

    registerAdmin: (req, res) =>{
        return res.render('superAdmin/admin_register')
    }
}