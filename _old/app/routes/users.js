const express = require('express');
const bodyParser = require('body-parser');

const h = require('../services/helpers');
const db = require('../services/database');

const router = express.Router();
const parseJSON = bodyParser.json();

typicalPostRequest('/edit/:userID', function(user) {
  // находим пользователя по id
  // обновляем все поля, указанные в объекте
    // если получается, то
      // возвращаем пользователя с новыми данными
    // если не получается, то
      // выводим ошибку

  res = user;
  return res;
});

typicalGetRequest('/user/rating', function(request) {
  // вынимаем всех аннотаторов, сортируя по рейтингу (по убыванию)


  return res;
});

router.route('/registered')
    .get(function(request, response){
      // вынимаем всех аннотаторов, подтвердивших email
      query = {
        cols: 'firstName, secondName, email, price',
        where: `Annot_video.dbo.AnnotatorTasksMarkUP.AID = Annot_video.dbo.Annotators.AID`
      };
      db.select('Annotators, Annot_video.dbo.AnnotatorTasksMarkUP', query, (data) => {
        console.log(data)

        for (user of data) {
          // собираем информацию по проектам
          user.projects = 2;
          user.completed = 7;
          user.progress = [
            50,
            83
          ];
        }

        response.send(JSON.stringify(data)); // отправляем данные
      });
    });


// typicalGetRequest('/user/:id', function(request) {
//   // находим пользователя по id
//   // проверяем, если авторизован, то

//   res = request.params.id;
//   return res;
// });

module.exports = router;


function typicalGetRequest(route, requestAction) {
  router.route(route)
    .get(function(request, response){
      outData = requestAction(request);
      response.send(JSON.stringify(outData)); // отправляем данные
    });
}

function typicalPostRequest(route, requestAction) {
  router.route(route)
    .post(parseJSON, function(request, response){
      const inData = request.body; // принимаем данные
      outData = requestAction(inData);
      response.send(JSON.stringify(outData)); // отправляем данные
    });
}