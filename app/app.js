var express = require('express');
var sign = require('./routes/sign');
var users = require('./routes/users');
var confirm = require('./routes/confirm');
var moneyRequests = require('./routes/moneyRequests');
var projects = require('./routes/projects');

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static('dist'));
app.use('/sign', sign);
app.use('/users', users);
app.use('/confirm', confirm);
app.use('/moneyRequests', moneyRequests);
app.use('/projects', projects);

app.listen(port, function(){
  console.log('Сервер доступен по адресу http://localhost:' + port);
});