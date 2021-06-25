const pool = require('../config/dbConfig');

module.exports = {

    saveNotice: (adminId, body, uploadNotice, cb) =>{
        pool.query(
            `INSERT INTO notice_board (admin_id, notice_title, recipient, notice_desc, content) VALUES(?, ?, ?, ?, ?)`,
            [
                adminId,
                body.noticeTitle,
                body.recipient,
                body.noticeDesc,
                uploadNotice
            ],
            (e, r) =>{
                if (e) {
                    return cb(e);
                }
                return cb(null, r);
            }
        )
    },

    createOtp: (userId, email, role, otp_code, cb) =>{
        pool.query(`INSERT INTO otp (user_id, email, role, otp) VALUES(?, ?, ?, ?)`,
        [
            userId,
            email,
            role,
            otp_code
        ],
        (e, d) =>{
            if (e) {
                return cb(e);
            }
            return cb(null, d)
        }
    )}
}