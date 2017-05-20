var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
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

typicalGetRequest('/user/registered', function(request) {
  // вынимаем всех аннотаторов, подтвердивших email

  return res;
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