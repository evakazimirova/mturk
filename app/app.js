var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

// app.get('/', function(request, response){
//   response.send('Hello world');
// });

app.use(express.static('dist'));

app.listen(port, function(){
  console.log();
  console.log('Сервер доступен по адресу http://localhost:' + port);
});