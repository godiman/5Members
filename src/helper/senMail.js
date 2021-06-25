const nodemailer = require('nodemailer');

// create the transport 
const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});


module.exports = transport;