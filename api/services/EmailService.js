const nodemailer = require('nodemailer');

const config = {
  service: 'Outlook365',
  auth: {
    user: process.env.MAILER_EMAIL || sails.config.mail.MAILER_EMAIL,
    pass: process.env.MAILER_PASS || sails.config.mail.MAILER_PASS
  }
}

let transporter = nodemailer.createTransport(config);

const emailGenerator = (to, subject, letter) => {
  let mailOptions = {
    from: '"Emotion Miner" <info@emotionminer.com>',
    to: to,
    subject: subject,
    html: letter
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};

module.exports = {
  onSignUp: (user) => {
    const link = `http://${user.hostName}/annotators/confirmEmail?email=${user.email}&token=${user.emailToken}`;

    emailGenerator(
      user.email,
      'Registration',
      `
        <p>Dear ${user.firstName} ${user.secondName}!</p>
        <p>Thanks for your registration in Emotion Miner video annotation service.</p>
        <p>
          To complete the process and confirm your email, please click the link below.<br>
          <a href="${link}">${link}</a>
        </p>
        <p>If you received this email by mistake, please feel free to ignore and delete it.</p>
      `
    );
  },


  onRegistered: (user) => {
    // 3й абзац
    // <p>
    //   Your ID: Name11<br>
    //   Your password: namepass
    // </p>

    emailGenerator(
      user.email,
      'Registration succeed',
      `
        <p>
          Welcome to Emotion Miner annotation service!
        </p>

        <p>
          Hi ${user.firstName}, welcome to Emotion Miner annotation service!
          You've signed up successfully!
        </p>

        <p>
          To start making money is quite simple!
          <ol>
            <li>
              Go to your user profile "My_profile"
            </li>
            <li>
              Fill in the form
            </li>
            <li>
              Complete Demo Task and earn your first money on Emotion Miner!
            </li>
          </ol>
        </p>

        <p>
          Find answers to frequently asked questions (please visit FAQ) or contact us.
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  onForgotPassword: (user) => {
    emailGenerator(
      user.email,
      'Change Password',
      `
        <p>Dear ${user.firstName} ${user.secondName},</p>
        <p>Here is <a href="http://${user.hostName}/annotators/forgotPassword?email=${user.email}&token=${user.emailToken}">your link</a> for changing current password.</p>
        <p>If you do not understand why you have received this letter, please just ignore it.</p>
      `
    );
  },


  onMoneyRequest: (mRequest) => {
    emailGenerator(
      'm.ryabov@neurodatalab.com, y.lavrinenko@neurodatalab.com, noggatur@ya.ru',
      'New Money Request',
      `
        <p>Dear Mr. Admin,</p>
        <p>Annotator <strong>${mRequest.AID.firstName} ${mRequest.AID.secondName}</strong> has earned <strong>${mRequest.price} RUR</strong> and wants to receive this amount of money.</p>
        <p>Please, <a href="http://${mRequest.hostName}">go to the web-site and pay</a> as soon as possible.</p>
      `
    );
  },


  onFeedback: (feedback) => {
    emailGenerator(
      'm.ryabov@neurodatalab.com, y.lavrinenko@neurodatalab.com, noggatur@ya.ru',
      'Feedback from ' + feedback.email,
      `
        <p>Dear Mr. Admin,</p>
        <p>The user with email <strong>${feedback.email}</strong> has sent you the following message:</p>
        <p>${feedback.message}</p>
      `
    );
  }
}