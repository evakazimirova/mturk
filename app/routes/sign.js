const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const configuration = require('./../config');

const router = express.Router();
const parseJSON = bodyParser.json();
let transporter = nodemailer.createTransport(configuration.email);


typicalPostRequest('/up', function(req) {
  res = req;

  var connection = new Connection(configuration.db);

  // Attempt to connect and execute queries if connection goes through
  connection.on('connect', function(err) {
      if (err) {
        console.log(err)
      }
      else{
        createTableAnnotators();
        insertIntoDatabase();
        sendMail();
      }
  });

  function createTableAnnotators(){
    console.log("Creating annotators table...");
      request = new Request(`
        CREATE TABLE 'teachers' (
          'id' INT(11) NOT NULL,
          'firstName' VARCHAR(25) NOT NULL,
          'secondName' VARCHAR(25) NOT NULL,
          'login' VARCHAR(25) NOT NULL,
          'email' VARCHAR(25) NOT NULL,
          'password' VARCHAR(25) NOT NULL,
          PRIMARY KEY ('id')
        )
      `,
      function(err, rowCount, rows) {
        console.log(err);
        console.log(rowCount);
        console.log(rows);
      }
    );
    connection.execSql(request);
  }

  function insertIntoDatabase(){
    console.log("Inserting a brand new user into database...");
    request = new Request(
      `INSERT INTO Annotators (firstName, secondName, login, email, password) VALUES (${req.firstName}, ${req.secondName}, ${req.login}, ${req.email}, ${req.password})`, // OUTPUT INSERTED.ProductID
      function(err, rowCount, rows) {
        console.log(rowCount + ' row(s) inserted');
      }
    );
    connection.execSql(request);
  }

  function sendMail() {
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
  }

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