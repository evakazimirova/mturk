/**
 * AnnotatorController
 *
 * @description :: Server-side logic for managing Annotators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// сообщаем, когда пользователь в последний раз заходил на сайт
const updateLastLogin = (AID) => {
  AnnotatorInfo.update(
    {
      AID: AID
    },
    {
      lastlogin: new Date()
    }
  ).exec(() => {});
};

module.exports = {
  // отвечаем авторизован ли пользователь
  authorized: (req, res, next) => {
    // выясняем, в каком режиме находимся
    if (req.session.changesPassword) {
      // смена пароля
      res.json({
        chPass: true,
        email: req.session.changesPassword
      });
    } else {
      // выясняем авторизован ли пользователь
      if (req.session.isAuth) {
        // отдаём данные пользователя
        AnnotatorInfo.findOne({
          AID: req.session.userId
        }).populate('AID').exec((error, annotator) => {
          if (!annotator.banned) {
            // сообщаем, когда пользователь в последний раз заходил на сайт
            updateLastLogin(req.session.userId);

            // передаём данные пользователя
            const user = {
              nickname: annotator.AID.login,
              rating: annotator.rating,
              money: {
                available: annotator.moneyAvailable,
                reserved: 0,
              },
              profile: annotator.profile,
              englishTest: annotator.englishTest,
              demo: annotator.demo,
              level: annotator.level,
              taskTaken: annotator.taskTaken,
              firstTime: annotator.firstTime
            };

            // отправляем результат
            res.json(user);
          } else {
            res.send('false');
          }
        });
      } else {
        res.send('false');
      }
    }
  },


  // список всех аннотаторов и проектов
  withTasks: (req, res, next) => {
    Annotators.find().populateAll().exec((error, annotators) => {
      res.json(annotators);
    });
  },


  // первичный заход на сайт
  firstTime: (req, res, next) => {
    AnnotatorInfo.update(
      {
        AID: req.session.userId
      },
      {
        firstTime: 0
      }
    ).exec((error, annotators) => {
      res.send();
    });
  },


  // вынимаем всех аннотаторов, сортируя по убыванию рейтинга
  rating: (req, res, next) => {
    // достаеём данные аннотаторов
    AnnotatorInfo.find({
      registered: 1,
    }).populateAll().sort('rating DESC').exec((error, annotators) => {
      // собираем информацию по проектам
      let annoList = [];
      for (annotator of annotators) {
        annoList.push({
          name: `${annotator.AID.login}`,
          completed: 0,
          rating: annotator.rating || 0
        });
      }

      // отправляем результат
      res.json(annoList);
    });
  },


  // вынимаем всех аннотаторов, подтвердивших email
  registered: (req, res, next) => {
    AnnotatorInfo.find({
      registered: 1
    }).populateAll().sort('rating DESC').exec((error, annotators) => {
      // собираем информацию по проектам
      let annoList = [];
      for (annotator of annotators) {
        // let cp = 0,
        //     np = 0,
        //     pp = 0;

        // for (let a of annotator.tasks) {
        //   if (a.status === 3) {
        //     cp++;
        //   }
        //   if (a.status === 1) {
        //     np++;
        //   }
        // }

        annoList.push({
          AID: annotator.AID,
          name: `${annotator.AID.login}`,
          email: annotator.AID.email,
          active: np || 0,
          completed: cp || 0,
          rating: annotator.rating,
          progress: pp || 0,
          banned: annotator.banned
        });
      }

      // отправляем результат
      res.json(annoList);
    });
  },


  // регистрация нового аннотатора
  register: (req, res, next) => {
    // запоминаем данные запроса
    let user = req.params.all();

    // проверяем корректность введённых данных
    if (user.email === "") {
      res
        .status(400)
        .send('no email');
    } else {
      // проверяем, есть ли такой пользователь
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

          // регистрируем аннотатора
          Annotators.create(user, (err, annotator) => {
            if (err) {
              return next(err);
            } else {
              // создаём таблицу с личными данными пользвоателя
              AnnotatorProfile.create({
                AID: annotator.AID,
                name: `${user.secondName}, ${user.firstName}`,
              }).exec((error, updated) => {
              });

              // генерируем токен
              const emailToken = CryptoService.generateTokenFromJSON(user);
              user.emailToken = emailToken;
              Tokens.create({
                AID: annotator.AID,
                token: emailToken
              }).exec((err, token) => {
                // отправляем оповещение на почту новому аннотатору
                user.hostName = req.headers.host;
                EmailService.onSignUp(user);

                // отправляем почту
                res.json({email: user.email});
              });
            }
          });
        } else {
          if (annotator.email === user.email) {
            Tokens.findOne({
              AID: annotator.AID
            }).exec((err, token) => {
              // проверяем, было ли подтверждение
              if (token) {
                // не было — отправляем повторное письмо
                user.hostName = req.headers.host;
                user.emailToken = token.token;
                EmailService.onSignUp(user);

                res.status(400).send('email exists resend');
              } else {
                // было — пусть восстанваливает пароль
                res.status(400).send('email exists');
              }
            });
          } else if (annotator.login === user.login) {
            res.status(400).send('login exists');
          }
        }
      });
    }
  },


  // подтверждение email
  confirmEmail: (req, res, next) => {
    let user = req.params.all();

    // проверяем токен при подтверждении регистрации
    Tokens.findOne({
      token: user.token
    }).populateAll().exec((error, token) => {
      if (token) {
        if (token.AID.email === user.email) {

          // удаляем токен
          Tokens.query(`DELETE FROM tokens WHERE token = '${token.token}'`, [], (error, result) => {
            if (error) {
              sails.log(error);
            } else {
              // создаём таблицу с дополнительной информацией
              AnnotatorInfo.create({
                AID: token.AID.AID,
                registered: 1
              }).exec((error, updated) => {});

              // авторизируем пользователя
              req.session.userId = token.AID.AID;
              req.session.isAuth = true;

              // переходим на сайт
              res.redirect('/');
            }
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
    // запоминаем данные запроса
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
      // обрабатываем ошибки
      if (annotator) {
        if (user.password === annotator.password) {
          // вынимаем дополнительную инфу
          AnnotatorInfo.findOne({ // лучше использовать populate. но не выходить (нужно чтобы sails сам создал таблицу)
            AID: annotator.AID
          }).exec((error, otherInfo) => {
            if (otherInfo.registered) {
              if (!otherInfo.banned) {
                // авторизируем пользователя
                req.session.isAuth = true;
                req.session.userId = annotator.AID;

                // сообщаем, когда пользователь в последний раз заходил на сайт
                updateLastLogin(req.session.userId);

                // передаём данные пользователя
                const user = {
                  nickname: annotator.login,
                  rating: otherInfo.rating,
                  money: {
                    available: otherInfo.moneyAvailable,
                    reserved: 0,
                  },
                  profile: otherInfo.profile,
                  englishTest: otherInfo.englishTest,
                  demo: otherInfo.demo,
                  level: otherInfo.level,
                  taskTaken: otherInfo.taskTaken,
                  firstTime: otherInfo.firstTime
                };

                // отправляем результат
                res.json(user);
              } else {
                res.status(400).send('banned');
              }
            } else {
              res.status(400).send('email is not validated');
            }
          });
        } else {
          res.status(400).send('incorrect password');
        }
      } else {
        res.status(400).send('no email');
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

    // сообщаем об успехе
    res.send('true');
  },


  // напоминание пароля
  forgot: (req, res, next) => {
    // запоминаем данные запроса
    let user = req.params.all();

    // ищем пользователя по email
    Annotators.findOne({
      email: user.email
    }).exec((error, annotator) => {
      if (annotator) {
        // генерируем токен и записываем в базу
        annotator.emailToken = CryptoService.generateTokenFromJSON(annotator);

        const doAfterCheckToken = () => {
          // высылаем письмо со ссылкой на страницу смены пароля
          annotator.hostName = req.headers.host;
          EmailService.onForgotPassword(annotator);

          // сообщаем об успехе
          res.send('true');
        };

        Tokens.findOne({
          AID: annotator.AID
        }).exec((error, token) => {
          if (token) {
            // токен уже есть — обновляем
            Tokens.update(
              {
                AID: annotator.AID
              },
              {
                token: annotator.emailToken
              }
            ).exec((error, updated) => {
              doAfterCheckToken();
            });
          } else {
            // токена ещё нет — создаём
            Tokens.create(
              {
                AID: annotator.AID,
                token: annotator.emailToken
              }
            ).exec((error, updated) => {
              doAfterCheckToken();
            });
          }
        });
      } else {
        res.status(400).send('no email');
      }
    });
  },


  // переход на страницу изменения пароля
  forgotPassword: (req, res, next) => {
    // запоминаем данные запроса
    let user = req.params.all();

    // проверяем токен
    Tokens.findOne({
      token: user.token
    }).populateAll().exec((error, token) => {
      if (token) {
        if (token.AID.email === user.email) {
          // удаляем токен
          Tokens.query(`DELETE FROM tokens WHERE token = '${user.token}'`, [], (error, result) => {
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
    const email = req.session.changesPassword;
    const newPass = CryptoService.encryptPassword(req.param('password'));

    // запускаем пользователя на сервер
    Annotators.findOne({
      email: email
    }).exec((error, annotator) => {
      if (annotator) {
        // обновляем пароль
        Annotators.update(
          {
            AID: annotator.AID
          },
          {
            password: newPass
          }
        ).exec((error, updated) => {
          // проверяем, регистрировался ли пользователь
          AnnotatorInfo.findOne({
            AID: annotator.AID
          }).exec((error, annotatorInfo) => {
            // если ещё не регистрировался
            if (!annotatorInfo) {
              // регистрируем и создаём таблицу с дополнительной информцией
              AnnotatorInfo.create({
                AID: annotator.AID,
                registered: 1
              }).exec((error, updated) => {});
            }

            // редактируем сессию
            req.session.isAuth = true;
            req.session.userId = annotator.AID;
            delete req.session.changesPassword

            // // сообщаем, когда пользователь в последний раз заходил на сайт
            // updateLastLogin(req.session.userId);

            // // отправляем данные пользователя
            // res.json(annotator);

            // перезапускаем сайт
            res.redirect('/');
          });
        });
      }
    });
  },

  ban: (req, res, next) => {
    const banned = req.param('banned') == 'true'; // преобразуем строку в булево значение

    // обновляем бан-статус аннотатора
    AnnotatorInfo.update(
      {
        AID: req.param('AID')
      },
      {
        banned: banned
      }
    ).exec((error, annotator) => {
      if (annotator) {
        // отправляем результат
        res.json({
          banned: banned
        });
      }
    });
  },


  // окончание демонстрационной задачи
  demoFinnished: (req, res, next) => {
    // обновляем данные пользователя
    AnnotatorInfo.update(
      {
        AID: req.session.userId
      },
      {
        moneyAvailable: 1,
        demo: 1
      }
    ).exec((error, annotatorInfo) => {
      if (annotatorInfo) {
        // сообщаем об успехе
        res.json(true);
      }
    });
  },

  getData: (req, res, next) => {
    // обновляем личные данные аннотатора
    Annotators.findOne({
      AID: req.session.userId
    }).exec((error, annotator) => {
      res.json({
        login: annotator.login,
        email: annotator.email
      });
    });
  },

  updateAccount: (req, res, next) => {
    // // обновляем личные данные аннотатора
    // Annotators.findOne({
    //   AID: req.session.userId
    // }).exec((error, annotator) => {
    //   res.json({
    //     login: annotator.login,
    //     email: annotator.email
    //   });
    // });

    res.send('ok');
  }

};