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
  signUp: (user) => {
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

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  registered: (user) => {
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


  feedback: (feedback) => {
    emailGenerator(
      'm.ryabov@neurodatalab.com, y.lavrinenko@neurodatalab.com, noggatur@ya.ru',
      'Feedback from ' + feedback.email,
      `
        <p>
          Dear Mr. Admin,
        </p>
        <p>
          The user with email <strong>${feedback.email}</strong> has sent you the following message:
        </p>
        <p>
          ${feedback.message}
        </p>
      `
    );
  },


  forgotPassword: (user) => {
    const link = `http://${user.hostName}/annotators/forgotPassword?email=${user.email}&token=${user.emailToken}`;

    emailGenerator(
      user.email,
      'Password reset request for Emotion Miner video annotation service',
      `
        <p>
          Hi, ${user.firstName}!
        </p>

        <p>
          We’ve just received a password reset request for Emotion Miner.
          Please click here to reset your password:
          <a href="${link}">${link}</a>
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  deadlineAlert: (user) => {
    // Прошло 50% срока отведенного на задачу - это три дня или неделя в зависимости от задачи
    // Наличие у пользователя взятой задачи; тип задачи и ее длительность; количество времени прошедшее со взятия; текущая дата
    // имя, дней до дедлайна, дата окончания задачи, ссылка на портал
    // формат даты — Sunday, February 19th
    emailGenerator(
      user.email,
      `${user.daysLeft}(7) days before Standard Task deadline`,
      `
        <p>
          Hi, ${user.firstName}!
        </p>

        <p>
          Please consider that your Task deadline is <strong>${user.deadline}</strong>! You still have <strong>${user.daysLeft}</strong> days to complete your Task!
        </p>

        <p>
          <a href="https://emotionminer.com">Go to my Standard Task</a>.
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  deadlineMissed: (user) => {
    // Cрок по вашей задаче истек
    // Если пользователь не закрыл задачу в срок
    emailGenerator(
      user.email,
      'Missed deadline for your Task',
      `
        <p>
          Hi, ${user.firstName}!
        </p>

        <p>
          Please consider that you’ve missed the deadline for your Task, so this task is locked for you, sorry about it.
        </p>

        <p>
          But you can take another task!
        </p>

        <p>
          <a href="https://emotionminer.com">Go to Task board</a>.
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  taskRefusal: (user) => {
    emailGenerator(
      user.email,
      'Task refusal confirmation',
      `
        <p>
          Hi, ${user.firstName}!
        </p>

        <p>
          Thank you for notification!
          We would like to confirm you that we’ve received your task refusal.
          Your balance has been topped up with appropriate sum.
        </p>

        <p>
          Now you can take another task!
        </p>

        <p>
          <a href="https://emotionminer.com">Go to Task board</a>.
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  testsFinished: (user) => {
    emailGenerator(
      user.email,
      'Congratulations on finishing all types of mini-tests!',
      `
        <p>
          Hi, ${user.firstName}!
        </p>

        <p>
          Congratulations on finishing all types of mini-tests!
          Now you can take more profitable tasks (Extended Tasks and Jedi Master Task)!
        </p>

        <p>
          <a href="https://emotionminer.com">Go to Task board</a>.<br>
          Also, you can improve your emotion recognition skills by passing any other required mini-tests.
        </p>

        <p>
          <a href="https://emotionminer.com">Go to mini-tests page</a>
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  moneyRequest: (mRequest) => {
    emailGenerator(
      'm.ryabov@neurodatalab.com, y.lavrinenko@neurodatalab.com, noggatur@ya.ru',
      'New Money Request',
      `
        <p>
          Dear Mr. Admin,
        </p>
        <p>
          Annotator <strong>${mRequest.AID.name}</strong> has earned <strong>${mRequest.price} RUR</strong> and wants to receive this amount of money.
        </p>
        <p>
          Please, <a href="http://${mRequest.hostName}">go to the web-site and pay</a> as soon as possible.
        </p>
      `
    );
  },


  moneyRequestAlert: (user) => {
    emailGenerator(
      user.email,
      'Your money transfer query is accepted',
      `
        <p>
          Hi, ${user.firstName}!
        </p>

        <p>
          Thank you for collaboration!
          Your money transfer query is accepted.
          We’ll check your results and make money transfer onto your bank card provided within one week.
        </p>

        <p>
          If the withdrawal request is erroneous, please contact us.
        </p>

        <p>
          <a href="mailto:info@emotionminer.com">Contact us</a>
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  moneyTransferConfirmation: (user) => {
    // Мы провели платеж по указаным рекизитам
    // данные по денежным операциям
    // имя, ссылка на создать новое паисьмо
    emailGenerator(
      user.email,
      'Money transfer confirmation',
      `
        <p>
          Hi, ${user.firstName}!
        </p>

        <p>
          We’ve just made the money transfer onto your bank card provided to us!
          Thank you for collaboration!
        </p>

        <p>
          If you’ve not received your money yet, please contact us.
        </p>

        <p>
          <a href="mailto:info@emotionminer.com">Contact us</a>
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  networkingAward: (user) => {
    // мы зачислили вам 10% от людей которых вы привлекли на портал по итогам недели
    // раз в неделю, когда выплачиваем за друзей
    // имя, сслыка на networking на портале
    emailGenerator(
      user.email,
      'Great news for you!',
      `
        <p>
          Great news for you, ${user.firstName}!
        </p>

        <p>
          We are glad to inform you that we’ve credited your Emotion Miner account with 10% of your friend's completed tasks revenue.
          Thanks a lot for your precious collaboration!
          Keep in touch!
        </p>

        <p>
          <a href="https://emotionminer.com">Invite more friends</a>
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  },


  networkingInvite: (user) => {
    // приглашение на портал
    // приглашение от зарегистрированного аннотатора
    // имя приглашающего
    emailGenerator(
      user.email,
      'Join to Emotion Miner!',
      `
        <p>
          Hi, ${user.firstName}!
        </p>

        <p>
        Hi! We’re pleased to inform you that your friend “name” has already participated with success in our money-paid online annotation project “Emotion Miner”. It would be wonderful if you could take part in!
        </p>

        <p>
          All details you can find here:<br>
          <a href="https://www.emotionminer.com">www.emotionminer.com</a><br>
        </p>

        <p>
          Seize the occasion, grab the chance!
        </p>

        <p>
          Best regards,<br>
          Emotion Miner Team
        </p>
      `
    );
  }
}