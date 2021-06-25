const accountService = require('../services/accountService');
const studentService = require('../services/studentService');
const lectService = require('../services/lectService');
const bcrypt = require('bcryptjs');

module.exports = {

    get_home: (req, res) => {

        const ui = req.user.uId;
        //console.log(ui);
        accountService.findU_i(ui, (e, r) => {
            if (e) {
                return console.log(e);
            }
            const role = r[0].role;
            //console.log(role);
            studentService.findAllNotice(role, (er, d) => {
                if (er) {
                    return console.log(er);
                }
                //console.log(d);
                res.render('lecturerView/home', {
                    notice: d
                })
            })
        })

    },

    get_notice: (req, res) => {

        const notice_id = req.query.read;
        studentService.findNoticeById(notice_id, (e, r) => {
            if (e) {
                return console.log(e);
            }
            // console.log(r);
            return res.render('lecturerView/notice_detail', {
                notice: r
            });
        })
    },

    lectAccount: (req, res) => {

        const body = req.body;
        // Validating name input
        // English letters, spaces and the following symbols ' - . are allowed
        const nameRegex = '^[a-zA-Z \'.-]*$';

        const reg_noRegex = '^[a-zA-Z 0-9 /.-]*$';

        if (body.name === "" || body.regNo === "" || body.password === "" || body.phone === "" || body.v_token === "") {
            let err = "All fields are required";
            return res.render('superAdmin/admin_register', {
                error: err
            });
        }

        if (!body.name.match(nameRegex)) {
            let err = "name should not contain number.";
            return res.render('superAdmin/admin_register', {
                error: err
            });
        }

        if (!body.regNo.match(reg_noRegex)) {
            let err = "Invalid Reg No.";
            return res.render('superAdmin/admin_register', {
                error: err
            });
        }

        if (body.password !== body.conPass) {
            //console.log(body.password.length);
            let err = "Password does not match";
            return res.render('superAdmin/admin_register', {
                error: err
            });
        }

        if (body.password.len < 5) {
            //console.log(body.password.length);
            let err = "Password does not match";
            return res.render('superAdmin/admin_register', {
                error: err
            });
        }

        lectService.findToken(body.v_token, (e, r) => {
            if (e) {
                return console.log(e);
            }
            // check if token is valid
            if (!r[0] || r[0].otp != body.v_token) {
                let err = "Invalid verification token";
                return res.render('superAdmin/admin_register', {
                    error: err
                });
            }

            const role = r[0].role;
            //console.log('Role: ', role);

            // Time that the link was generated
            let token_life = r[0].date_sent;
            token_life = new Date(token_life);
            let t_life = token_life.getTime() + (30 * 60 * 1000);
            // current time
            let c_time = Date.now();

            //console.log('Added time: ', t_life);
            //console.log(c_time);
            // checks if the token has expired
            if (c_time > t_life) {
                let err = 'Expired link....'
                return res.render('superAdmin/admin_register', {
                    error: err
                });
            }


            // Get staff ID
            accountService.findRegNo(body.regNo, async(err, s) =>{
                if (err) {
                    return console.log(err);
                }
                if (s.length > 0) {
                    let err = "Staff ID has already been used.";
                    return res.render('superAdmin/admin_register', {error: err});
                }
                body.name = body.name.trim();
                body.regNo = body.regNo.trim();
                body.phone = body.phone.trim();


                // Generate unique id
                const u_i = Math.random().toString(36).substr(2, 7);
                //console.log('Unique id: ', u_i);

                // hash the password
                body.password = await bcrypt.hash(body.password, 8);

                accountService.createUser(body, role, u_i, (e, s) =>{
                    if (e) {
                        return console.log(e);
                    }
                    let msg = 'Account has been created.'
                    return res.render('index', {success: msg});
                })
            })      

        })

    },

    get_appointment: (req, res) =>{

        const uni = req.user.uId;
        accountService.findU_i(uni, (e, d) =>{
            if (e) {
                return console.log(e);
            }
            //console.log(d);
            const lect_id = d[0].user_id;

            lectService.findUnique(lect_id, (e, u) =>{
                if (e) {
                    return console.log(e);
                }
                //console.log(u)
                return res.render('lecturerView/appointment', {u: u});
            })
        })
        
    },

    reply: (req, res)=>{
        
        const stud_id = req.query.read;
        //console.log(stud_id);
        return res.render('lecturerView/reply', {st_id: stud_id});
    },

    postReply: (req, res) =>{
        console.log(req.body);
        const body = req.body;
        if (body.msg == '') {
            let err = 'Reply is empty..';
            return res.render('lecturerView/reply', {error: err});
        }
        
        lectService.updateReply(body.stud_id, body.msg, (e, r) =>{
            if (e) {
                return console.log(e);
            }
           // console.log(body.stud_id)
            //console.log(r);
            let msg = 'Reply sent..';
            return res.render('lecturerView/reply', {success: msg});
        })
    }
}