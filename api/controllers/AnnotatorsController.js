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
          const user = {
            nickname: annotator.login,
            rating: annotator.rating,
            money: {
              available: annotator.moneyAvailable,
              reserved: 0,
            }
          };

          res.json(user);
        });
      } else {
        res.json(process.env.DB);
      }
    }
  },


  // список всех аннотаторов и проектов
  withTasks: (req, res, next) => {
    Annotators.find().populateAll().exec((error, annotators) => {
      res.json(annotators);
    });
  },


  // вынимаем всех аннотаторов, сортируя по рейтингу (по убыванию)
  rating: (req, res, next) => {
    Annotators.find({
      registered: 1,
    }).populateAll().sort('rating DESC').exec((error, annotators) => {
      let annoList = [];

      // собираем информацию по проектам
      for (annotator of annotators) {
        annoList.push({
          name: `${annotator.firstName} ${annotator.secondName}`,
          completed: annotator.tasks.length,
          rating: annotator.rating
        });
      }

      res.json(annoList);
    });
  },


  // вынимаем всех аннотаторов, подтвердивших email
  registered: (req, res, next) => {
    Annotators.find({
      registered: 1
    }).populateAll().sort('rating DESC').exec((error, annotators) => {
      let annoList = [];

      // собираем информацию по проектам
      for (annotator of annotators) {
        let cp = 0,
            np = 0,
            pp = 0;

        for (let a of annotator.tasks) {
          if (a.status === 3) {
            cp++;
          }
          if (a.status === 1) {
            np++;
            // total = task.TID.emotions.split(',').length;
            // pp = a.;
          }
        }


        annoList.push({
          name: `${annotator.firstName} ${annotator.secondName}`,
          email: annotator.email,
          active: np,
          completed: cp,
          rating: annotator.rating,
          progress: pp
        });
      }

      res.json(annoList);
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
              user.hostName = req.headers.host;
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


  // подтверждение email
  confirmEmail: (req, res, next) => {
    let user = req.params.all();

    // проверяем токен при подтверждении регистрации
    Annotators.findOne({
      email: user.email
    }).exec((error, annotator) => {
      if (annotator) {
        if (annotator.emailToken === user.token) {
          Annotators.update(
            {
              email: user.email
            },
            {
              emailToken: null, // удаляем токен
              registered: 1     // изменяем статус пользователя
            }
          ).exec((error, updated) => {
            // авторизируем пользователя
            req.session.userId = annotator.AID;
            req.session.isAuth = true;

            // переходим на сайт
            res.redirect('/');
          });
        } else {
          // пользователь уже зарегистрирован. нужно восстановить пароль
          // res.send({error: "already registered"});
          res.redirect('/');
        }
      } else {
        // сообщаем о том, что ссылка недействительна (почта не зарегистрирована) и переводим на страницу авторизации
        // res.send({error: "token invalid"});
        res.redirect('/');
      }
    });
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

            const user = {
              nickname: annotator.login,
              rating: annotator.rating,
              money: {
                available: annotator.moneyAvailable,
                reserved: 0,
              }
            };

            // возвращаем все данные текущего пользователя
            res.json(user);
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


  // выходим из системы
  logout: (req, res, next) => {
    // редактируем сессию
    req.session.isAuth = false;
    delete req.session.userId;

    // выходим из режима восстановления пароля
    delete req.session.changesPassword;

    res.send('true');
  },


  // напоминание пароля
  forgot: (req, res, next) => {
    let user = req.params.all();
    Annotators.findOne({
      email: user.email
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
        ).exec((error, updated) => {
          // высылаем письмо со ссылкой на страницу смены пароля
          annotator.hostName = req.headers.host;
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


  // переход на страницу изменения пароля
  forgotPassword: (req, res, next) => {
    let user = req.params.all();

    // проверяем токен
    Annotators.findOne({
      email: user.email
    }).exec((error, annotator) => {
      if (annotator) {
        if (annotator.emailToken === user.token) {
          Annotators.update(
            {
              email: user.email
            },
            {
              emailToken: null, // удаляем токен
              registered: 1     // изменяем статус пользователя
            }
          ).exec((error, updated) => {
            // авторизируем пользователя
            req.session.changesPassword = user.email;

            // переходим на сайт
            res.redirect('/');
          });
        } else {
          // пользователь уже зарегистрирован. нужно восстановить пароль
          // res.send({error: "already registered"});
          res.redirect('/');
        }
      } else {
        // сообщаем о том, что ссылка недействительна (почта не зарегистрирована) и переводим на страницу авторизации
        // res.send({error: "token invalid"});
        res.redirect('/');
      }
    });
  },


  // изменение пароля
  changePass: (req, res, next) => {
    // принимаем данные
    const newPass = CryptoService.encryptPassword(req.param('password'));
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
            emailToken: null,
            registered: 1
          }
        ).exec((error, updated) => {
          // редактируем сессию
          req.session.isAuth = true;
          req.session.userId = annotator.AID;

          // отправляем данные пользователя
          res.json(annotator);
        });
      }
    });
  },

  // login: (req, res, next) => {},
};


// Редактирование пользователя
//   // находим пользователя по id
//   // обновляем все поля, указанные в объекте
//     // если получается, то
//       // возвращаем пользователя с новыми данными
//     // если не получается, то
//       // выводим ошибку