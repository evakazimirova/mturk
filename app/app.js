const Connection = require('tedious').Connection;
const configuration = require('./config');

// пытаемся подключиться к базе данных
global.db = new Connection(configuration.db);
module.exports = global.db.on('connect', function(err) {
  if (err) {
    console.log(err)
  } else {
    var express = require('express');
    var cookieParser = require('cookie-parser');
    var session = require('express-session')
    var sign = require('./routes/sign');
    var users = require('./routes/users');
    var confirm = require('./routes/confirm');
    var moneyRequests = require('./routes/moneyRequests');
    var projects = require('./routes/projects');

    var app = express();
    var port = process.env.PORT || 8080;

    app.use(express.static('dist'));
    app.use(cookieParser());
    app.use(session({
      secret: 'wrqr39q4twer8tvq9u48fdr9qwu',
      resave: true,
      saveUninitialized: true
    }));

    // методы для всех путей
    app.use('/sign', sign);
    app.use('/users', users);
    app.use('/confirm', confirm);
    app.use('/moneyRequests', moneyRequests);
    app.use('/projects', projects);

    // // сессия пользователя
    // app.get("/", (req, res) => {
    //   var pass = req.session.loggedIn;
    //   console.log(pass);
    //   next();
    //   // if (pass) {
    //   //   next();
    //   // } else {
    //   //   res.redirect("/");
    //   // }
    // });

    app.listen(port, function(){
      console.log('Сервер доступен по адресу http://localhost:' + port);
    });
  }
});