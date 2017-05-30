/**
 * AnnotatorController
 *
 * @description :: Server-side logic for managing Annotators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // отвечаем авторизован ли пользователь
  authorized: (req, res, next) => {
    if (req.session.changesPassword) {
      // смена пароля
      res.json({
        chPass: true,
        email: req.session.changesPassword
      });
    } else {
      if (req.session.isAuth) {
        // отдаём данные пользователя
        Annotators.findOne({
          AID: req.session.userId
        }).exec((error, annotator) => {
          res.json(annotator);
        });
      } else {
        res.send('false');
      }
    }
  },


  // список всех аннотаторов и проектов
  withTasks: (req, res, next) => {
    Annotators.find().populateAll().exec((error, annotators) => {
      console.log(annotators);
      res.json(annotators);
    });
  },


  // регистрация нового аннотатора
  register: (req, res, next) => {
    let user = req.params.all();

    // проверяем, есть ли такой пользователь
    if (user.email === "") {
      res
        .status(400)
        .send('no email');
    } else {
      Annotators.findOne({
        or: [
          {email: user.email},
          {login: user.login}
        ]
      }).exec((error, annotator) => {
        // если пользователь новый, то регистрируем
        if (!annotator) {
          // шифруем пароль
          user.password = CryptoService.encryptPassword(user.password);

          // генерируем токен
          const emailToken = CryptoService.generateTokenFromJSON(user);
          user.emailToken = emailToken;

          // регистрируем аннотатора
          Annotators.create(user, (err, annotator) => {
            if (err) {
              return next(err);
            } else {
              // отправляем оповещение на почту новому аннотатору
              EmailService.onSignUp(user);

              res.json({email: user.email}); // отправляем данные
            }
          });
        } else {
          if (annotator.login === user.login) {
            console.log("Annotator with this login is already exists in the system.");
            res
              .status(400)
              .send('login exists');
          }
          if (annotator.email === user.email) {
            console.log("Annotator with this email is already exists in the system.");
            res
              .status(400)
              .send('user exists');
          }
        }
      });
    }
  },

  // вход в систему
  login: (req, res, next) => {
    let user = req.params.all();

    // шифруем пароль
    user.password = CryptoService.encryptPassword(user.password);

    // ищем пользователя по указанным данным
    Annotators.findOne({
      or: [
        {email: user.login},
        {login: user.login}
      ]
    }).exec((error, annotator) => {
      if (annotator) {
        if (user.password === annotator.password) {
          if (annotator.registered) {
            // авторизируем пользователя
            req.session.isAuth = true;
            req.session.userId = annotator.AID;

            // удаляем пароль из пересылаемого объекта
            delete annotator.password;
            delete annotator.registered; // и инфу о валидации почты

            // возвращаем все данные текущего пользователя
            res.json(annotator); // отправляем данные
          } else {
            res
              .status(400)
              .send('email is not validated');
          }
        } else {
          res
            .status(400)
            .send('incorrect password');
        }
      } else {
        console.log("There is no any account matching this email.");
        res
          .status(400)
          .send('no email');
      }
    });
  },


  forgot: (req, res, next) => {
    let user = req.params.all();
    Annotators.findOne({
      or: [
        {email: user.login},
        {login: user.login}
      ]
    }).exec((error, annotator) => {
      if (annotator) {
        annotator.emailToken = CryptoService.generateTokenFromJSON(annotator);

        // генерируем токен и записываем в базу
        Annotators.update(
          {
            AID: annotator.AID
          },
          {
            emailToken: annotator.emailToken
          }
        ).exec((error, annotator) => {
          // высылаем письмо со ссылкой на страницу смены пароля
          EmailService.onForgotPassword(annotator);
          res.send('true');
        });
      } else {
        console.log("There is no any account matching this email.");
        res
          .status(400)
          .send('no email');
      }
    });
  },

  changepass: (req, res, next) => {
    // принимаем данные
    const newPass = CryptoService.encryptPassword(req.params('password'));
    const email = req.session.changesPassword;

    // запускаем пользователя на сервер
    Annotators.findOne({
      email: email
    }).exec((error, annotator) => {
      if (annotator) {
        // обновляем пароль
        Annotators.update(
          {
            email: email
          },
          {
            password: newPass,
            emailToken: '',
            registered: 1
          }
        ).exec((error, annotator) => {
          // редактируем сессию
          req.session.isAuth = true;
          req.session.userId = annotator.AID;

          // отправляем данные пользователя
          res.json(annotator);
        });
      }
    });
  },

  // выходим из системы
  logout: (req, res, next) => {
    // редактируем сессию
    req.session.isAuth = false;
    delete req.session.userId;

    // выходим из режима восстановления пароля
    delete req.session.changesPassword;

    res.send('true');
  }

  // login: (req, res, next) => {},
};







// typicalPostreq('/edit/:userID', function(user) {
//   // находим пользователя по id
//   // обновляем все поля, указанные в объекте
//     // если получается, то
//       // возвращаем пользователя с новыми данными
//     // если не получается, то
//       // выводим ошибку

//   res = user;
//   return res;
// });

// typicalGetreq('/user/rating', function(req) {
//   // вынимаем всех аннотаторов, сортируя по рейтингу (по убыванию)


//   return res;
// });

// router.route('/registered')
//     .get(function(req, res){
//       // вынимаем всех аннотаторов, подтвердивших email
//       query = {
//         cols: 'firstName, secondName, email, price',
//         where: `Annot_video.dbo.AnnotatorTasksMarkUP.AID = Annot_video.dbo.Annotators.AID`
//       };
//       db.select('Annotators, Annot_video.dbo.AnnotatorTasksMarkUP', query, (data) => {
//         console.log(data)

//         for (user of data) {
//           // собираем информацию по проектам
//           user.projects = 2;
//           user.completed = 7;
//           user.progress = [
//             50,
//             83
//           ];
//         }

//         res.send(JSON.stringify(data)); // отправляем данные
//       });
//     });








// router.route('/registration/:email/:token')
//   .get(function(req, res){
//     // проверяем токен при подтверждении регистрации
//     query = {
//       cols: 'AID, email, emailToken',
//       where: `email = '${req.params.email}'`
//     };
//     db.select('Annotators', query, (data) => {
//       if (data.length > 0) {
//         if (data[0].emailToken === req.params.token) {
//           update = {
//             emailToken: '', // удаляем токен
//             registered: 1   // изменяем статус пользователя
//           };

//           db.update('Annotators', update, `emailToken = '${req.params.token}'`);

//           // авторизируем пользователя
//           req.session.isAuth = true;
//           req.session.userId = data[0].AID;

//           // переходим на сайт
//           res.redirect('/');
//         } else {
//           // пользователь уже зарегистрирован. нужно восстановить пароль
//           // res.send({error: "already registered"});
//           res.redirect('/');
//         }
//       } else {
//         // сообщаем о том, что ссылка недействительна (почта не зарегистрирована) и переводим на страницу авторизации
//         // res.send({error: "token invalid"});
//         res.redirect('/');
//       }
//     });
//   });


// router.route('/forgotpassword/:email/:token')
//   .get(function(req, res){
//     // проверяем токен
//     query = {
//       cols: 'AID, email, emailToken',
//       where: `email = '${req.params.email}'`
//     };
//     db.select('Annotators', query, (data) => {
//       if (data.length > 0) {
//         if (data[0].emailToken === req.params.token) {
//           update = {
//             emailToken: '', // удаляем токен
//           };

//           db.update('Annotators', update, `email = '${req.params.email}'`);

//           req.session.changesPassword = req.params.email;

//           // переходим на сайт
//           res.redirect('/');
//         } else {
//           // пользователь уже зарегистрирован. нужно восстановить пароль
//           // res.send({error: "already registered"});
//           res.redirect('/');
//         }
//       } else {
//         // сообщаем о том, что ссылка недействительна (почта не зарегистрирована) и переводим на страницу авторизации
//         // res.send({error: "token invalid"});
//         res.redirect('/');
//       }
//     });
//   });