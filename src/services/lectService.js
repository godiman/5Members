
const pool = require('../config/dbConfig');

module.exports = {
    
    findToken: (token, cb) =>{

        pool.query(
            `SELECT otp, role, date_sent FROM otp WHERE otp = ?`,
            [
                token
            ],
            (e, d) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, d);
            }
        )
    },

    findNumber: (phone, cb) =>{
        pool.query(
            `SELECT user_id, phone, name FROM si_user WHERE phone = ?`,
            [
                phone
            ],
            (e, s) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, s);
            }
        )
    },

    findUnique: (id, cb)=>{
        pool.query(
            `SELECT si_user.name, appointment.content, appointment.reply, appointment.sender_id, appointment.date_sent FROM si_user
            INNER JOIN appointment ON si_user.user_id = appointment.sender_id WHERE receiver_id = ?`,
            [
                id
            ],
            (e, s) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, s);
            }
        )
    },

    updateReply: (reply, stud_id, cb) =>{
        pool.query(
            `UPDATE appointment SET reply=? WHERE sender_id = ?`,
            [
                stud_id,
                reply
            ],
            (e, m) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, m);
            }
        )
    }
}