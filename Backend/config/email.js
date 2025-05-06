require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD
    }
});

transporter.verify((error) => {
    if (error) {
        console.error('Email config error:', error);
    } else {
        console.log('✅ Email server ready');
    }
});

module.exports = transporter;