/**
 * AnnotatorController
 *
 * @description :: Server-side logic for managing Annotators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // отвечаем авторизован ли пользователь
  authorized: (req, res, next) => {
    res.send('false');

    // if (request.session.changesPassword) {
    //   // смена пароля
    //   response.send(JSON.stringify({
    //     chPass: true,
    //     email: request.session.changesPassword
    //   }));
    // } else {
    //   if (request.session.isAuth) {
    //     query = {
    //       cols: 'AID, firstName, secondName, login, email',
    //       where: `AID = '${request.session.userId}'`
    //     };

    //     // отдаём данные пользователя
    //     db.select('Annotators', query, (data) => {
    //       response.send(JSON.stringify(data[0]));
    //     });
    //   } else {
    //     response.send('false');
    //   }
    // }
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

    // const user = request.body; // принимаем данные
    // // шифруем пароль
    // user.password = h.encryptPassword(user.password);

    // // ищем пользователя с указанными данными
    // query = {
    //   cols: 'AID, firstName, secondName, login, email, password, registered',
    //   where: `email = '${user.login}' OR login = '${user.login}'`
    // };
    // db.select('Annotators', query, (data) => {
    //   if (data.length > 0) {
    //     if (user.password === data[0].password) {
    //       if (data[0].registered) {
    //         // авторизируем пользователя
    //         request.session.isAuth = true;
    //         request.session.userId = data[0].AID;

    //         // удаляем пароль из пересылаемого объекта
    //         delete data[0].password;
    //         delete data[0].registered; // и инфу о валидации почты

    //         // возвращаем все данные текущего пользователя
    //         response.send(JSON.stringify(data[0])); // отправляем данные
    //       } else {
    //         response.status(400).send('email is not validated');
    //       }
    //     } else {
    //       response.status(400).send('incorrect password');
    //     }
    //   } else {
    //     console.log("There is no any account matching this email.");
    //     response.status(400).send('no email');
    //   }
    // });
  },


  forgot: (req, res, next) => {
    // const user = request.body; // принимаем данные

    // // ищем пользователя по почте
    // query = {
    //   cols: 'AID, firstName, secondName, email',
    //   where: `email = '${user.email}'`
    // };
    // db.select('Annotators', query, (data) => {
    //   if (data.length > 0) {
    //     // генерируем токен и записываем в базу
    //     update = {
    //       emailToken: h.generateTokenFromJSON(data)
    //     }
    //     db.update('Annotators', update, `AID = '${data[0].AID}'`);

    //     // высылаем письмо со ссылкой на страницу смены пароля
    //     data[0].emailToken = update.emailToken;
    //     mailer.onForgotPassword(data[0]);

    //     response.send('true');
    //   } else {
    //     console.log("There is no any account matching this email.");
    //     response.status(400).send('no email');
    //   }
    // });
  },

  changepass: (req, res, next) => {
    // const newPass = request.body.password; // принимаем данные
    // const email = request.session.changesPassword;

    // // запускаем пользователя на сервер
    // query = {
    //   cols: 'AID, firstName, secondName, login, email',
    //   where: `email = '${email}'`
    // };
    // db.select('Annotators', query, (data) => {
    //   if (data.length > 0) {
    //     // обновляем пароль
    //     update = {
    //       password: h.encryptPassword(newPass),
    //       emailToken: '',
    //       registered: 1
    //     }
    //     db.update('Annotators', update, `email = '${email}'`);

    //     // редактируем сессию
    //     request.session.isAuth = true;
    //     request.session.userId = data[0].AID;

    //     // отправляем данные пользователя
    //     response.send(JSON.stringify(data[0]));
    //   }
    // });
  },

  // выходим из системы
  logout: (req, res, next) => {
    // // редактируем сессию
    // request.session.isAuth = false;
    // delete request.session.userId;

    // // выходим из режима восстановления пароля
    // delete request.session.changesPassword;

    // response.send('true');
  }

  // login: (req, res, next) => {},
};







// typicalPostRequest('/edit/:userID', function(user) {
//   // находим пользователя по id
//   // обновляем все поля, указанные в объекте
//     // если получается, то
//       // возвращаем пользователя с новыми данными
//     // если не получается, то
//       // выводим ошибку

//   res = user;
//   return res;
// });

// typicalGetRequest('/user/rating', function(request) {
//   // вынимаем всех аннотаторов, сортируя по рейтингу (по убыванию)


//   return res;
// });

// router.route('/registered')
//     .get(function(request, response){
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

//         response.send(JSON.stringify(data)); // отправляем данные
//       });
//     });








// router.route('/registration/:email/:token')
//   .get(function(request, response){
//     // проверяем токен при подтверждении регистрации
//     query = {
//       cols: 'AID, email, emailToken',
//       where: `email = '${request.params.email}'`
//     };
//     db.select('Annotators', query, (data) => {
//       if (data.length > 0) {
//         if (data[0].emailToken === request.params.token) {
//           update = {
//             emailToken: '', // удаляем токен
//             registered: 1   // изменяем статус пользователя
//           };

//           db.update('Annotators', update, `emailToken = '${request.params.token}'`);

//           // авторизируем пользователя
//           request.session.isAuth = true;
//           request.session.userId = data[0].AID;

//           // переходим на сайт
//           response.redirect('/');
//         } else {
//           // пользователь уже зарегистрирован. нужно восстановить пароль
//           // response.send({error: "already registered"});
//           response.redirect('/');
//         }
//       } else {
//         // сообщаем о том, что ссылка недействительна (почта не зарегистрирована) и переводим на страницу авторизации
//         // response.send({error: "token invalid"});
//         response.redirect('/');
//       }
//     });
//   });


// router.route('/forgotpassword/:email/:token')
//   .get(function(request, response){
//     // проверяем токен
//     query = {
//       cols: 'AID, email, emailToken',
//       where: `email = '${request.params.email}'`
//     };
//     db.select('Annotators', query, (data) => {
//       if (data.length > 0) {
//         if (data[0].emailToken === request.params.token) {
//           update = {
//             emailToken: '', // удаляем токен
//           };

//           db.update('Annotators', update, `email = '${request.params.email}'`);

//           request.session.changesPassword = request.params.email;

//           // переходим на сайт
//           response.redirect('/');
//         } else {
//           // пользователь уже зарегистрирован. нужно восстановить пароль
//           // response.send({error: "already registered"});
//           response.redirect('/');
//         }
//       } else {
//         // сообщаем о том, что ссылка недействительна (почта не зарегистрирована) и переводим на страницу авторизации
//         // response.send({error: "token invalid"});
//         response.redirect('/');
//       }
//     });
//   });