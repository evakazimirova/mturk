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
    if (request.session.changesPassword) {
      // смена пароля
      response.send(JSON.stringify({
        chPass: true,
        email: request.session.changesPassword
      }));
    } else {
      if (request.session.isAuth) {
        query = {
          cols: 'AID, firstName, secondName, login, email',
          where: `AID = '${request.session.userId}'`
        };

        // отдаём данные пользователя
        db.select('Annotators', query, (data) => {
          response.send(JSON.stringify(data[0]));
        });
      } else {
        response.send('false');
      }
    }
  });


router.route('/up')
  .post(parseJSON, function(request, response){
    const newUser = request.body; // принимаем данные

    if (newUser.email === "") {
      response.status(400).send('no email');
    } else {
      // проверяем, есть ли такой пользователь
      query = {
        cols: 'email, login',
        where: `email = '${newUser.email}' OR login = '${newUser.login}'`
      };
      db.select('Annotators', query, (data) => {
        if (data.length > 0) {
          if (data[0].login === newUser.login) {
            console.log("Annotator with this login is already exists in the system.");
            response.status(400).send('login exists');
          }
          if (data[0].email === newUser.email) {
            console.log("Annotator with this email is already exists in the system.");
            response.status(400).send('user exists');
          }
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

    // шифруем пароль
    user.password = h.encryptPassword(user.password);

    // ищем пользователя с указанными данными
    query = {
      cols: 'AID, firstName, secondName, login, email, password, registered',
      where: `email = '${user.login}' OR login = '${user.login}'`
    };
    db.select('Annotators', query, (data) => {
      if (data.length > 0) {
        if (user.password === data[0].password) {
          if (data[0].registered) {
            // авторизируем пользователя
            request.session.isAuth = true;
            request.session.userId = data[0].AID;

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


router.route('/forgot')
  .post(parseJSON, function(request, response){
    const user = request.body; // принимаем данные

    // ищем пользователя по почте
    query = {
      cols: 'AID, firstName, secondName, email',
      where: `email = '${user.email}'`
    };
    db.select('Annotators', query, (data) => {
      if (data.length > 0) {
        // генерируем токен и записываем в базу
        update = {
          emailToken: h.generateTokenFromJSON(data)
        }
        db.update('Annotators', update, `AID = '${data[0].AID}'`);

        // высылаем письмо со ссылкой на страницу смены пароля
        data[0].emailToken = update.emailToken;
        mailer.onForgotPassword(data[0]);

        response.send('true');
      } else {
        console.log("There is no any account matching this email.");
        response.status(400).send('no email');
      }
    });
  });


// выходим из системы
router.route('/changepass')
  .post(parseJSON, (request, response) => {
    const newPass = request.body.password; // принимаем данные
    const email = request.session.changesPassword;

    // запускаем пользователя на сервер
    query = {
      cols: 'AID, firstName, secondName, login, email',
      where: `email = '${email}'`
    };
    db.select('Annotators', query, (data) => {
      if (data.length > 0) {
        // обновляем пароль
        update = {
          password: h.encryptPassword(newPass),
          emailToken: '',
          registered: 1
        }
        db.update('Annotators', update, `email = '${email}'`);

        // редактируем сессию
        request.session.isAuth = true;
        request.session.userId = data[0].AID;

        // отправляем данные пользователя
        response.send(JSON.stringify(data[0]));
      }
    });
  });


// выходим из системы
router.route('/out')
  .get((request, response) => {
    // редактируем сессию
    request.session.isAuth = false;
    delete request.session.userId;

    // выходим из режима восстановления пароля
    delete request.session.changesPassword;

    response.send('true');
  });


module.exports = router;