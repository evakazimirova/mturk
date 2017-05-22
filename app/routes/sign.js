const express = require('express');
const bodyParser = require('body-parser');

const h = require('../services/helpers');
const db = require('../services/database');
const mailer = require('../services/mailer');

const router = express.Router();
const parseJSON = bodyParser.json();


// отвечаем, зареган ли пользователь
router.route('/ed')
  .get((request, response) => {
    if (request.session.isAuth) {
      query = {
        cols: 'id, firstName, secondName, login, email',
        where: `id = '${request.session.userId}'`
      };

      // отдаём данные пользователя
      db.select('Annotators', query, (data) => {
        response.send(JSON.stringify(data[0]));
      });
    } else {
      response.send('false');
    }
  });


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


router.route('/in')
  .post(parseJSON, function(request, response){
    const user = request.body; // принимаем данные
    let error;

    // шифруем пароль
    user.password = h.encryptPassword(user.password);

    // ищем пользователя с указанными данными
    query = {
      cols: 'id, firstName, secondName, login, email, password, registered',
      where: `email = '${user.login}'`
    };
    db.select('Annotators', query, (data) => {
      if (data.length > 0) {
        if (user.password === data[0].password) {
          if (data[0].registered) {
            // авторизируем пользователя
            request.session.isAuth = true;
            request.session.userId = data[0].id;

            // удаляем пароль из пересылаемого объекта
            delete data[0].password;
            delete data[0].registered; // и инфу о валидации почты

            // возвращаем все данные текущего пользователя
            response.send(JSON.stringify(data[0])); // отправляем данные
          } else {
            response.status(400).send('email is not validated');
          }
        } else {
          response.status(400).send('incorrect password');
        }
      } else {
        console.log("There is no any account matching this email.");
        response.status(400).send('no email');
      }
    });
  });


typicalPostRequest('/forgot', function(req) {
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


// выходим из системы
router.route('/out')
  .get((request, response) => {
    // редактируем сессию
    request.session.isAuth = false;
    delete request.session.userId;

    response.send('');
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
