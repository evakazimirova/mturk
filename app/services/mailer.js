const nodemailer = require('nodemailer');
const configuration = require('../config');

let transporter = nodemailer.createTransport(configuration.email);

module.exports = {
  onSignUp: (newUser) => {
    let mailOptions = {
      from: '"NeuroDataLab" <info@neurodatalab.com>',
      to: newUser.email,
      subject: 'NeuroDataLab Registration',
      html: `
        <p>Dear ${newUser.firstName} ${newUser.secondName},</p>
        <p>Your e-mail just had been registered in NeuroDataLab annotation service.</p>
        <p>To be sure that this e-mail is really yours please click <a href="http://localhost:8080/confirm/registration/${newUser.email}/${newUser.emailToken}">this link</a> to finish registration.</p>
        <p>If you do not understand why you have received this letter, please just ignore it.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });
  },

  onForgotPassword: (user) => {
    let mailOptions = {
      from: '"NeuroDataLab" <info@neurodatalab.com>',
      to: user.email,
      subject: 'NeuroDataLab Change Password',
      html: `
        <p>Dear ${user.firstName} ${user.secondName},</p>
        <p>Here is <a href="http://localhost:8080/confirm/forgotpassword/${user.email}/${user.emailToken}">your link</a> for changing current password.</p>
        <p>If you do not understand why you have received this letter, please just ignore it.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });
  }
}