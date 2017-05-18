const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const parseJSON = bodyParser.json();

router.route('/up')
  .post(parseJSON, function(request, response){
    const newUser = request.body; // принимаем данные

    // users = {

    // }

    response.send(JSON.stringify(newUser)); // отправляем данные
  })
;

router.route('/in')
  .post(parseJSON, function(request, response){
    const newUser = request.body; // принимаем данные

    // users = {

    // }

    response.send(JSON.stringify(newUser)); // отправляем данные
  })
;

router.route('/out')
  .post(parseJSON, function(request, response){
    const newUser = request.body; // принимаем данные

    // users = {

    // }

    response.send(JSON.stringify(newUser)); // отправляем данные
  })
;

module.exports = router;