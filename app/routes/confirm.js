var express = require('express');
var router = express.Router();

const db = require('../services/database');

router.route('/registration/:sha1')
  .get(function(request, response){
    // проверяем токен при подтверждении регистрации
    update = {
      emailToken: '' // удаляем токен
      // изменяем статус пользователя
      // авторизируем пользователя
    };
    db.updateDataOfTable('Annotators', update, `emailToken = 'request.params.sha1'`);

    // после регистрации перенаправляем в личный кабинет
    response.redirect('/');

    // // проверяем токен при подтверждении регистрации
    // query = {
    //   cols: 'id',
    //   where: `emailToken = '${request.params.sha1}'`
    // };
    // db.selectDataFromTable('Annotators', query, (data) => {
    //   if (data.length > 0) {
    //     db.updateDataOfTable('Annotators', {emailToken: ''}, `id = '${data[0].id}'`);
    //     // изменяем статус пользователя
    //     // удаляем токен
    //     // авторизируем пользователя
    //     response.redirect('/');
    //   } else {
    //     // сообщаем о том, что ссылка недействительна и переводим на страницу авторизации
    //     response.redirect('/');
    //   }
    // });
  });

module.exports = router;