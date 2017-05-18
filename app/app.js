var express = require('express');
var auth = require('./routes/auth');
var users = require('./routes/users');

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static('dist'));
app.use('/auth', auth);
app.use('/users', users);

app.listen(port, function(){
  console.log();
  console.log('Сервер доступен по адресу http://localhost:' + port);
});