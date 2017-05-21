const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const h = require('../methods/helpers');
const db = require('../methods/database');

const configuration = require('../config');

const router = express.Router();
const parseJSON = bodyParser.json();
let transporter = nodemailer.createTransport(configuration.email);

typicalPostRequest('/up', function(newUser) {
  // Добавляем нового пользователя
    // Если получилось, то
      // генерируем токен
      // отправляем письмо ему на почту
      // проверяем токен при подтверждении регистрации
        // если есть такой, то
          // изменяем статус пользователя
          // удаляем токен
          // авторизируем пользователя
        // если нет, то
          // сообщаем о том, что ссылка недействительна и переводим на страницу авторизации
    // если не получилось зарегаться, то
      // выводим сообщение об ошибке
        // если такой пользователь уже есть, то предлагается восстановить пароль

  res = newUser;

  const emailToken = h.generateTokenFromJSON(newUser);
  res.emailToken = emailToken;
  res.password = h.encryptPassword(res.password);
  db.insertDataIntoTable('Annotators', res);

  // sendMail();

  function sendMail() {
    let mailOptions = {
      from: '"NeuroDataLab" <info@neurodatalab.com>',
      to: newUser.email,
      subject: 'NeuroDataLab Registration',
      html: `
        <p>Dear ${newUser.firstName} ${newUser.secondName},</p>
        <p>Your e-mail just had been registered in NeuroDataLab annotation service.</p>
        <p>To be sure that this e-mail is really yours please click <a href="http://localhost:8080/confirm/registration/${emailToken}">this link</a> to finish registration.</p>
        <p>If you do not understand why you have received this letter, please just ignore it.</p>
      `
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });
  }

  return res;
});

typicalPostRequest('/in', function(req) {
  // данные приходят в зашифрованном виде
  // ищем пользователя с указанными данными
    // если есть пользователь с такими данными, то
      // авторизируем
      // запускаем в систему
      // возвращаем все данные текущего пользователя и сохраняем во фронтенде
    // если нет, то выводим сообщение об ошибке

  res = req;
  return res;
});

typicalPostRequest('/out', function(req) {
  // ищем пользователя по почте
    // если есть пользователь, то
      // генерируем токен и записываем в базу
      // высылаем ему письмо со ссылкой на страницу смены пароля
        // если такой токен у кого-то есть, то предлагаем ему сменить пароль
          // при правильно введённом пароле даём доступ к системе
        // если нет, то выводим ошибку и перенаправляем в форму регистрации

  res = req;
  return res;
});

module.exports = router;

function typicalPostRequest(route, requestAction) {
  router.route(route)
    .post(parseJSON, function(request, response){
      const inData = request.body; // принимаем данные

      outData = requestAction(inData);

      response.send(JSON.stringify(outData)); // отправляем данные
    });
}
