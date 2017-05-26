require('dotenv').config();
const Connection = require('tedious').Connection;
const configuration = require('./config');
// пытаемся подключиться к базе данных
global.db = new Connection(configuration.db);

// console.log(configuration);

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
var port = process.env.PORT || 8080;

var sign = require('./routes/sign');
var users = require('./routes/users');
var confirm = require('./routes/confirm');
var moneyRequests = require('./routes/moneyRequests');
var projects = require('./routes/projects');

// методы для всех путей
app.use('/sign', sign);
app.use('/users', users);
app.use('/confirm', confirm);
app.use('/moneyRequests', moneyRequests);
app.use('/projects', projects);

app.use(cookieParser());
app.use(session({
  secret: configuration.secret,
  resave: true,
  saveUninitialized: true
}));

app.use(express.static('dist'));
// module.exports = global.db.on('connect', function(err) {
//   if (err) {
//     console.log(err)
//   } else {

//   }
// });

app.listen(port, function(){
  console.log('Сервер доступен по адресу http://localhost:' + port);
});