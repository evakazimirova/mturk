const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const configuration = require('./../config');

const router = express.Router();
const parseJSON = bodyParser.json();
let transporter = nodemailer.createTransport(configuration.email);


typicalPostRequest('/up', function(newUser) {
  res = newUser;

  // var connection = new Connection(configuration.db);

  // Attempt to connect and execute queries if connection goes through
  // connection.on('connect', function(err) {
  //     if (err) {
  //       console.log(err)
  //     }
  //     else{
  //     }
  // });


  const emailToken = generateTokenFromJSON(newUser);

  // createTableAnnotators();
  // insertIntoDatabase();
  sendMail();
  res.sha = emailToken;

  function sendMail() {
    let mailOptions = {
      from: '"NeuroDataLab" <info@neurodatalab.com>',
      to: newUser.email,
      subject: 'NeuroDataLab Registration',
      html: `
        <p>Dear ${newUser.firstName} ${newUser.secondName},</p>
        <p>Your e-mail just had been registered in NeuroDataLab annotation service.</p>
        <p>To be sure that this e-mail is really yours please click <a href="http://localhost:8080/confirm/registration/${emailToken}">this link</a> to finish registration.</p>
        <p>If you do not understand why you have received this letter, please just ignore it.</p>
      `
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

function generateTokenFromJSON(input) {
  return crypto.createHash('sha1').update(JSON.stringify(input) + new Date()).digest('hex');
}

// function createTableAnnotators(){
//   console.log("Creating annotators table...");
//     request = new Request(`
//       CREATE TABLE 'teachers' (
//         'id' INT(11) NOT NULL,
//         'firstName' VARCHAR(25) NOT NULL,
//         'secondName' VARCHAR(25) NOT NULL,
//         'login' VARCHAR(25) NOT NULL,
//         'email' VARCHAR(25) NOT NULL,
//         'password' VARCHAR(25) NOT NULL,
//         PRIMARY KEY ('id')
//       )
//     `,
//     function(err, rowCount, rows) {
//       console.log(err);
//       console.log(rowCount);
//       console.log(rows);
//     }
//   );
//   connection.execSql(request);
// }

// function insertIntoDatabase(){
//   console.log("Inserting a new user into database...");
//   request = new Request(
//     `INSERT INTO Annotators (firstName, secondName, login, email, password) VALUES (${newUser.firstName}, ${newUser.secondName}, ${newUser.login}, ${newUser.email}, ${newUser.password})`, // OUTPUT INSERTED.ProductID
//     function(err, rowCount, rows) {
//       console.log(rowCount + ' row(s) inserted');
//     }
//   );
//   connection.execSql(request);
// }