var nodemailer = require('nodemailer');
var config = require('../config/mailService.config')


module.exports = (emailAddress, emailSubject, emailMessage) => {
    var transporter = nodemailer.createTransport({
        ...config
    });

    var mailOptions = {
        from: 'test@lukaszkot.com',
        to: emailAddress,
        subject: emailSubject,
        html: emailMessage
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


