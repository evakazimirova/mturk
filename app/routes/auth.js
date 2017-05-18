const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const parseJSON = bodyParser.json();

router.route('/')
  .post(parseJSON, function(request, response){
    const req = request.body; // принимаем данные

    console.log(req);

    response.send(JSON.stringify(req)); // отправляем данные
  })
;

module.exports = router;