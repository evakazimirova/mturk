const express = require('express');
const bodyParser = require('body-parser');

const h = require('../services/helpers');
const db = require('../services/database');
const mailer = require('../services/mailer');

const router = express.Router();
const parseJSON = bodyParser.json();

typicalPostRequest('/up', function(newUser) {
  // проверяем, есть ли такой пользователь
  query = {
    cols: 'email',
    where: `email = '${newUser.email}'`
  };

  db.selectDataFromTable('Annotators', query, (data) => {
    // let response = {};

    if (data.length > 0) {
      console.log("Annotator with this email is already exists in the system.");
      // выводим сообщение об ошибке
      // если такой пользователь уже есть, то предлагается восстановить пароль
      // response.status = 400;
    } else {
      console.log("Adding a new annotator...");
      // шифруем пароль
      newUser.password = h.encryptPassword(newUser.password);

      // генерируем токен
      const emailToken = h.generateTokenFromJSON(newUser);
      newUser.emailToken = emailToken;

      // проверяем токен при подтверждении регистрации
        // если есть такой, то
          // изменяем статус пользователя
          // удаляем токен
          // авторизируем пользователя
        // если нет, то
          // сообщаем о том, что ссылка недействительна и переводим на страницу авторизации

      // отправляем оповещение на почту новому аннотатору
      db.insertDataIntoTable('Annotators', newUser);
      mailer.onSignUp(newUser);
    }
  });

  return newUser;
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
