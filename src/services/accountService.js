const pool = require('../config/dbConfig');

module.exports = {

    createUser: (body, role, u_i, cb)=>{
        pool.query(
            `INSERT INTO si_user (u_i, name, reg_no, phone, role, password) VALUES(?, ?, ?, ?, ?, ?)`,
            [
                u_i,
                body.name,
                body.regNo,
                body.phone,
                role,
                body.password
            ],
            (er, s) =>{
                if (er) {
                    return cb(er);
                }
                return cb(null, s);
            }
        )
    },

    findRegNo: (regNo, cb) =>{
        pool.query(
            `SELECT * FROM si_user WHERE reg_no = ?`,
            [
                regNo
            ],
            (er, s) =>{
                if (er) {
                    return cb(er);
                }
                return cb(null, s);
            }
        )
    },

    findU_i: (uId, cb)=>{
        pool.query(
            `SELECT user_id, name, reg_no, phone, role, password FROM si_user WHERE u_i = ?`,
            [
                uId
            ],
            (e, u) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, u);
            }
        )
    }
}