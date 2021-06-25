

// import account service
const accountService = require('../services/accountService');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


module.exports = {

    // Define the home controller
    index: (req, res) =>{
        res.render('index');
    },

     // Define the event controller
    event: (req, res) =>{
        res.render('event');
    },

    register: (req, res) =>{

        const body = req.body;
        // Validating name input
        // English letters, spaces and the following symbols ' - . are allowed
        const nameRegex = '^[a-zA-Z \'.-]*$';

        const reg_noRegex = '^[a-zA-Z 0-9 /.-]*$';

        if (body.name === "" || body.regNo === "" || body.password === "" || body.conPass ==="") {
            let err = "All fields are required";
            return res.render('index', {error: err});
        }

        if (!body.name.match(nameRegex)){
            let err = "name should not contain number.";
            return res.render('index', {error: err});
        }
        
        if (!body.regNo.match(reg_noRegex)){
            let err = "Invalid Reg No.";
            return res.render('index', {error: err});
        }

        if (body.password !== body.conPass) {
            //console.log(body.password.length);
            let err = "Password does not match";
            return res.render('index', {error: err});
        }

          if (body.password.len < 5) {
            //console.log(body.password.length);
            let err = "Password does not match";
            return res.render('index', {error: err});
        }

        // Get regNo
        accountService.findRegNo(body.regNo, async(err, s) =>{
            if (err) {
                return console.log(err);
            }
            if (s.length > 0) {
                let err = "Reg number has already been used.";
                return res.render('index', {error: err});
            }
            body.name = body.name.trim();
            body.regNo = body.regNo.trim();
            body.phone = body.phone.trim();

            
            // Generate unique id
            const u_i = Math.random().toString(36).substr(2, 7);
            //console.log('Unique id: ', u_i);

            // hash the password
            body.password = await bcrypt.hash(body.password, 8);

            accountService.createUser(body,body.role, u_i, (e, s) =>{
                if (e) {
                    return console.log(e);
                }
                let msg = 'Account has been created.'
                return res.render('index', {success: msg});
            })
        })        
    },

    auth: (req, res) =>{

        const body = req.body;

        if (body.regNo === "" || body.password === "") {
            let err = "All fields are required";
            return res.render('index', {error: err});
        }
        
        // Get user reg number
        accountService.findRegNo(body.regNo, async (e, u) =>{
            if (e) {
                return console.log(e);
            }

            if (!u[0] || !(await bcrypt.compare(body.password, u[0].password))) { 
                let err = "Incorrect reg number or password";
                return res.render('index', {error: err});
            }
            u[0]. password = undefined;

            //console.log(u);

            //user details
            const uin = u[0].u_i;   
            
            // Sign the users details with 
            const token = jwt.sign({uin}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRING_DATE})
            //console.log(token);

            // Generate cookie
            res.cookie('JWT', token, {
                expires: new Date(Date.now() + process.env.COOKIES_EXPIRATION),
            });
         
            if (u[0].role == 'hod') {
                return res.redirect('/admin-dashboard');
            }
            else if (u[0].role == 'Lecturer') {
                return res.redirect('/lecturer-dashboard');
            } else {
                return res.redirect('/student-dashboard');
            }        
        })   
    },

    get_logout: (req, res) =>{
        res.cookie('JW_TOKEN', '', {maxAge: 1});
        res.redirect('/')
    }
}