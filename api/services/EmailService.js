const nodemailer = require('nodemailer');

const config = {
  host: 'outlook.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILER_EMAIL || sails.config.mail.MAILER_EMAIL,
    pass: process.env.MAILER_PASS || sails.config.mail.MAILER_PASS
  }
}

let transporter = nodemailer.createTransport(config);

module.exports = {
  onSignUp: (user) => {
    const link = `http://${user.hostName}/annotators/confirmEmail?email=${user.email}&token=${user.emailToken}`;

    let mailOptions = {
      from: '"Emotion Miner" <info@emotionminer.com>',
      to: user.email,
      subject: 'NeuroDataLab Registration',
      html: `
        <p>Dear ${user.firstName} ${user.secondName}!</p>
        <p>Thanks for your registration in Emotion Miner video annotation service.</p>
        <p>
          To complete the process and confirm your email, please click the link below.<br>
          <a href="${link}">${link}</a>
        </p>
        <p>If you received this email by mistake, please feel free to ignore and delete it.</p>
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
      from: '"Emotion Miner" <info@emotionminer.com>',
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
  },


  onMoneyRequest: (mRequest) => {
    let mailOptions = {
      from: '"Emotion Miner" <info@emotionminer.com>',
      to: 'm.ryabov@neurodatalab.com, y.lavrinenko@neurodatalab.com, noggatur@ya.ru',
      subject: 'New Money Request',
      html: `
        <p>Dear Mr. Admin,</p>
        <p>Annotator <strong>${mRequest.AID.firstName} ${mRequest.AID.secondName}</strong> has earned <strong>${mRequest.price} RUR</strong> and wants to receive this amount of money.</p>
        <p>Please, <a href="http://${mRequest.hostName}">go to the web-site and pay</a> as soon as possible.</p>
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