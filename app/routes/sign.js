const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const parseJSON = bodyParser.json();

typicalPostRequest('/up', function(req) {
  res = req;
  return res;
});

typicalPostRequest('/in', function(req) {
  res = req;
  return res;
});

typicalPostRequest('/out', function(req) {
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