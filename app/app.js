var express = require('express');
var app = express();

// app.get('/', function(request, response){
//   response.send('Hello world');
// });

app.use(express.static('dist'));

app.listen(8080, function(){
  console.log();
  console.log('Сервер доступен по адресу http://localhost:8080');
});