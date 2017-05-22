var express = require('express');
var router = express.Router();

const db = require('../services/database');

router.route('/registration/:email/:token')
  .get(function(request, response){

  //   // проверяем токен при подтверждении регистрации
  //   update = {
  //     emailToken: '', // удаляем токен
  //     registered: 1   // изменяем статус пользователя
  //   };

  //   db.update('Annotators', update, `emailToken = '${request.params.token}'`);

  //   // авторизируем пользователя
  //   request.session.isAuth = true;

  //   // после регистрации перенаправляем в личный кабинет
  //   response.redirect('/');


    // проверяем токен при подтверждении регистрации
    query = {
      cols: 'id, email, emailToken',
      where: `email = '${request.params.email}'`
    };
    db.select('Annotators', query, (data) => {
      if (data.length > 0) {
        if (data[0].emailToken === request.params.token) {
          update = {
            emailToken: '', // удаляем токен
            registered: 1   // изменяем статус пользователя
          };

          db.update('Annotators', update, `emailToken = '${request.params.token}'`);

          // авторизируем пользователя
          request.session.isAuth = true;
          request.session.userId = data[0].id;

          // переходим на сайт
          response.redirect('/');
        } else {
          // пользователь уже зарегистрирован. нужно восстановить пароль
          // response.send({error: "already registered"});
          response.redirect('/');
        }
      } else {
        // сообщаем о том, что ссылка недействительна (почта не зарегистрирована) и переводим на страницу авторизации
        // response.send({error: "token invalid"});
        response.redirect('/');
      }
    });
  });

module.exports = router;