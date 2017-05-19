var express = require('express');
var sign = require('./routes/sign');
var users = require('./routes/users');

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static('dist'));
app.use('/sign', sign);
app.use('/users', users);

app.listen(port, function(){
  console.log('Сервер доступен по адресу http://localhost:' + port);
});