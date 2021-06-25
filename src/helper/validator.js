
require('dotenv').config();

const jwt = require('jsonwebtoken'); 

const accountService = require('../services/accountService');

module.exports = {

    validate_token: async(req, res, next) =>{
        //console.log('Token from the header: ', req.cookies.JWT);
          const token = req.cookies.JWT;
  
          // console log the token gottern ffrrom the header
          //console.log('Token in header: ', token);
  
          // checks if token exist
          try {
            if (!token || token == '') {
              return res.status(401).redirect('/');
            }
            else{
              // verifies the token
              const decode = await jwt.verify(token, process.env.JWT_SECRET);
              
              // Gets user information from the token
              req.user = {
                uId: decode.uin
              };
              //console.log('ID: ', req.user.uId)
              next();
            }
          } catch (err) {
            return res.status(500).json(err.toString());
          }
        },

        isAdmin: (req, res, next) =>{

          const uni = req.user.uId;

          accountService.findU_i(uni, (e, r) =>{
            if (e) {
              return console.log(e);
            }
            const role = r[0].role;
            //console.log(role);

            if (role == 'hod') {
              return next();
            }
            else {
              return res.redirect('/');
            }
          })

        },

        isLecturer: (req, res, next) =>{

          const uni = req.user.uId;

          accountService.findU_i(uni, (e, r) =>{
            if (e) {
              return console.log(e);
            }
            const role = r[0].role;

            //console.log(role);

            if (role == 'Lecturer') {
              return next();
            }
            else {
              return res.redirect('/');
            }
          })

        }
  
}