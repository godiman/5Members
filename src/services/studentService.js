const pool = require('../config/dbConfig');

module.exports = {

    changePass: (newPass, uni, cb) =>{
        pool.query(
            `UPDATE si_user SET password = ? WHERE u_i = ?`,
            [
                newPass,
                uni
            ],
            (e, d) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, d);
            }
        )
    },

    findAllNotice: (role, cb) => {

        pool.query(
            `SELECT notice_id, notice_title, notice_desc, recipient, content, date_sent FROM notice_board WHERE recipient = ? `,
            [
                role
            ],
            (e, r) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, r);
            }
        )
    },

    findNoticeById: (n_id, cb) =>{
        pool.query(
            `SELECT notice_title, notice_desc, content, date_sent FROM notice_board WHERE notice_id = ?`,
            [
                n_id
            ],
            (e, r) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, r);
            }
        )
    },

    createApp: (sender, reciever, content, cb) =>{
        pool.query(
            `INSERT INTO appointment (sender_id, receiver_id, content) VALUES(?, ?, ?)`,
            [
                sender,
                reciever,
                content
            ],
            (e, d) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, d);
            }
        )
    },

    findReply: (id, cb)=>{
        pool.query(
            `SELECT si_user.name, appointment.content, appointment.reply, appointment.sender_id, appointment.date_sent FROM si_user
            INNER JOIN appointment ON si_user.user_id = appointment.sender_id WHERE sender_id = ?`,
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
}