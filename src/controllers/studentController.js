
// import account services
const accountService = require('../services/accountService');
const studentService = require('../services/studentService');

// import bcryptjs
const bcrypt = require('bcryptjs');
const lectService = require('../services/lectService');

module.exports = {
    
    home: (req, res) =>{
        const ui = req.user.uId;
        //console.log(ui);
        accountService.findU_i(ui, (e, r) =>{
            if (e) {
                return console.log(e);
            }
            const role = r[0].role;
            //console.log(role);
            studentService.findAllNotice(role, (er, d) =>{
                if (er) {
                    return console.log(er);
                }
                //console.log(d);
                return res.render('studentView/home', {notice: d})
            })
        })
        
    },

    settings: (req, res) =>{
        
        const uni = req.user.uId;

        accountService.findU_i(uni, (e, r) =>{
            if (e) {
                return console.log(e);
            }
            res.render('studentView/settings', {u: r});
        })
        
    },

    changePassword: (req, res) =>{

        const body = req.body;
        const uni = req.user.uId;

        if (body.oldPass === "" || body.newPass === "" || body.newPass.toString().trim() != body.confirmNew) {
            let err = "Password do not match";
            return res.render('studentView/settings', {error: err});
        }
        if (body.oldPass.toString().trim() == body.newPass) {
            let err = "Enter new password";
            return res.render('studentView/settings', {error: err});
        }
        
        // hash the new password
        //console.log(body.oldPass);

        accountService.findU_i(uni, async(er, p) =>{

            // compares the old password 
            if (! (await bcrypt.compare(body.oldPass, p[0].password))) {
                let err = "Incorrect password";
                return res.render('studentView/settings', {error: err});
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
                return res.render('studentView/settings', {success: msg});
            })
        })

    },

    get_notice: (req, res) =>{
        
        const notice_id = req.query.read;
        studentService.findNoticeById(notice_id, (e, r) =>{
            if (e) {
                return console.log(e);
            }
           // console.log(r);
            return res.render('studentView/notice_detail', {notice: r});
        })
    },

    appointment: (req, res) =>{
        
        const body = req.body;
        const uni = req.user.uId; 

        if (body.phone =='' || body.content == '') {
            let err = 'All fields are required';
            return res.render('studentView/home', {error: err})
        }

        lectService.findNumber(body.phone, (er, d) =>{
            if (er) {
                return console.log(er);
            }
            if (!d[0] || d.length <0) {
                let err = 'Phone number does not exist...';
                return res.render('studentView/home', {error: err})
            }
            // Get the lecturer id and name
            const lect_id = d[0].user_id;
            
            accountService.findU_i(uni, (e, r) =>{
                if (e) {
                    return console.log(e);
                }
                // Gets the student id
                const stud_id = r[0].user_id;

                studentService.createApp(stud_id, lect_id, body.content, (ero, u) =>{
                    if (ero) {
                        return console.log(ero);
                    }
                    //console.log(u);
                    let msg = 'Your appointment has been submitted..';
                    return res.render('studentView/home', {success: msg})
                })
            })
        })
    },

    viewReply: (req, res) =>{

        const uni = req.user.uId;

        accountService.findU_i(uni, (e, r) =>{
            if (e) {
                return console.log(e);
            }
            
            const userId = r[0].user_id;
            studentService.findReply(userId, (er, m) =>{
                if (er) {
                    return console.log(er);
                }
                //console.log(m);
                return res.render('studentView/view_reply', {m: m});
            })
        })
        
    }
}