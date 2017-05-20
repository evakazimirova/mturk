var express = require('express');
var router = express.Router();

typicalPostRequest('/post', function(user) {
  // добавляем запрос в базу данных
    // если всё ок, то
      // отправляем уведомление на почту администратора
      // сообщаем пользователю о том, что всё ок
    // если не ок, то
      // сообщаем пользователю о том, что всё не ок

  res = user;
  return res;
});

typicalGetRequest('/get', function(user) {
  // вынимаем все поступившие вопросы о выводе средств

  res = user;
  return res;
});

typicalPostRequest('/update/:requestID', function(user) {
  // обновляем выбранный запрос

  res = user;
  return res;
});

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