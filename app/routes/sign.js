const express = require('express');
const bodyParser = require('body-parser');

const h = require('../services/helpers');
const db = require('../services/database');
const mailer = require('../services/mailer');

const router = express.Router();
const parseJSON = bodyParser.json();

router.route('/up')
  .post(parseJSON, function(request, response){
    const newUser = request.body; // принимаем данные
    let error;

    if (newUser.email === "") {
      response.status(400).send('no email');
    } else {
      // проверяем, есть ли такой пользователь
      query = {
        cols: 'email',
        where: `email = '${newUser.email}'`
      };
      db.select('Annotators', query, (data) => {
        if (data.length > 0) {
          console.log("Annotator with this email is already exists in the system.");
          response.status(400).send('user exists');
        } else {
          console.log("Adding a new annotator...");
          // шифруем пароль
          newUser.password = h.encryptPassword(newUser.password);

          // генерируем токен
          const emailToken = h.generateTokenFromJSON(newUser);
          newUser.emailToken = emailToken;

          // регистрируем аннотатора
          db.insert('Annotators', newUser);

          // отправляем оповещение на почту новому аннотатору
          mailer.onSignUp(newUser);

          response.send(JSON.stringify({email: newUser.email})); // отправляем данные
        }
      });
    }
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
