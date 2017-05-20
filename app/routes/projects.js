var express = require('express');
var router = express.Router();

typicalGetRequest('/allowed/:userID', function(user) {
  // вынимаем все проекты, доступные для аннотатора, кроме тех, которые он уже выполнял и тех, которую сделали 10 раз (для каждой задачи своё значение)
  // порядок задач: чем меньше людей её делали, тем на более высоком месте она стоит

  res = user;
  return res;
});

typicalPostRequest('/take/:projectID', function(user) {
  // если задача не была ранее выполнена аннотатором
    // проект присваивается пользователю
    // фиксируется стоимость проекта для этого пользователя
    // Когда аннотатор в личном кабинете нажимает «нажмите для начала» ему выдается задача по порядку, не случайным образом. То-есть если для задачи 1 установлено количество аннотаторов 10, то задача 2 не выдается пока не будет выдано половина от лимита 5 раз. Таким образом задача 1 будет выдана в 6 ой раз после того как Задача i (последняя) будет выдана 5 раз.



  res = user;
  return res;
});

typicalPostRequest('/edit/:userID', function(user) {
  // обновляем проект

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