const nodemailer = require('nodemailer');

const config = {
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS
  }
}

let transporter = nodemailer.createTransport(config);

module.exports = {
  onSignUp: (user) => {
    let mailOptions = {
      from: '"NeuroDataLab" <info@neurodatalab.com>',
      to: user.email,
      subject: 'NeuroDataLab Registration',
      html: `
        <p>Dear ${user.firstName} ${user.secondName},</p>
        <p>Your e-mail just had been registered in NeuroDataLab annotation service.</p>
        <p>To be sure that this e-mail is really yours please click <a href="http://${user.hostName}/annotators/confirmEmail?email=${user.email}&token=${user.emailToken}">this link</a> to finish registration.</p>
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
        <p>Here is <a href="http://${user.hostName}/annotators/forgotPassword?email=${user.email}&token=${user.emailToken}">your link</a> for changing current password.</p>
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