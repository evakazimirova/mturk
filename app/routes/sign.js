const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const parseJSON = bodyParser.json();

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'neurodatalab@gmail.com',
    pass: 'Mgimofinish2'
  }
});


typicalPostRequest('/up', function(req) {
  res = req;


  // setup email data with unicode symbols
  let mailOptions = {
    from: '"MAX 👻" <info@neurodatalab.com>',
    to: req.email,
    subject: 'NeuroDataLab Registration',
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

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