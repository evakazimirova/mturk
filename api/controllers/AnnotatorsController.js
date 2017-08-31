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
  ).exec((error, updated) => {
    if (error) {
      sails.log(error);
    }
  });
};

const domainFromUrl = (url) => {
  if (url.length > 0) {
    var result;
    var match;
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
      result = match[1];
      if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
        result = match[1];
      }
    }
    return result;
  }
}

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
          if (error) {
            sails.log(error);
          } else {
            if (!annotator.banned) {
              // сообщаем, когда пользователь в последний раз заходил на сайт
              updateLastLogin(req.session.userId);
              if (annotator.tutorials === null) {
                annotator.tutorials = [
                  [0, 0, 0],
                  [0, 0],
                  [0, 0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0, 0],
                  [0, 0, 0]
                ];
              } else {
                annotator.tutorials = JSON.parse(annotator.tutorials);
              }

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
                firstTime: annotator.firstTime,
                tutorials: annotator.tutorials
              };

              // отправляем результат
              res.json(user);
            } else {
              res.send('false');
            }
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
      if (error) {
        sails.log(error);
      } else {
        res.json(annotators);
      }
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
      if (error) {
        sails.log(error);
      } else {
        res.send();
      }
    });
  },


  // вынимаем всех аннотаторов, сортируя по убыванию рейтинга
  rating: (req, res, next) => {
    // достаеём данные аннотаторов
    AnnotatorInfo.find({
      registered: 1,
    }).populateAll().sort('rating DESC').exec((error, annotators) => {
      if (error) {
        sails.log(error);
      } else {
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
      }
    });
  },


  // вынимаем всех аннотаторов, подтвердивших email
  registered: (req, res, next) => {
    AnnotatorInfo.find({
      registered: 1
    }).populateAll().sort('rating DESC').exec((error, annotators) => {
      if (error) {
        sails.log(error);
      } else {
        // собираем информацию по проектам
        let annoList = [];
        for (annotator of annotators) {
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
      }
    });
  },


  // регистрация нового аннотатора
  register: (req, res, next) => {
    // запоминаем данные запроса
    let user = req.params.all();

    // проверяем корректность введённых данных
    if (user.email === "") {
      res.status(400).send('no email');
    } else {
      // проверяем, есть ли такой пользователь
      Annotators.findOne({
        or: [
          {email: user.email},
          {login: user.login}
        ]
      }).exec((error, annotator) => {
        if (error) {
          sails.log(error);
        } else {
          // если пользователь новый, то регистрируем
          if (!annotator) {
            // шифруем пароль
            user.password = CryptoService.encryptPassword(user.password);

            // регистрируем аннотатора
            Annotators.create(user).exec((error, annotator) => {
              if (error) {
                sails.log(error);
              } else {
                // создаём таблицу с личными данными пользвоателя
                AnnotatorProfile.create({
                  AID: annotator.AID,
                  name: `${user.secondName}, ${user.firstName}`
                }).exec((error, updated) => {
                  if (error) {
                    sails.log(error);
                  }
                });

                // создаём таблицу с дополнительной информацией
                AnnotatorInfo.create({
                  AID: annotator.AID,
                  referer: domainFromUrl(req.headers.referer) // откуда перешёл новый пользователь
                }).exec((error, updated) => {
                  if (error) {
                    sails.log(error);
                  }
                });

                // генерируем токен
                const emailToken = CryptoService.generateTokenFromJSON(user);
                user.emailToken = emailToken;
                Tokens.create({
                  AID: annotator.AID,
                  token: emailToken
                }).exec((error, token) => {
                  if (error) {
                    sails.log(error);
                  } else {
                    // отправляем оповещение на почту новому аннотатору
                    user.hostName = req.headers.host;
                    EmailService.signUp(user);

                    // отправляем почту
                    res.json({email: user.email});
                  }
                });
              }
            });
          } else {
            if (annotator.email === user.email) {
              Tokens.findOne({
                AID: annotator.AID
              }).exec((error, token) => {
                if (error) {
                  sails.log(error);
                } else {
                  // проверяем, было ли подтверждение
                  if (token) {
                    // не было — отправляем повторное письмо
                    user.hostName = req.headers.host;
                    user.emailToken = token.token;
                    EmailService.signUp(user);

                    res.status(400).send('email exists resend');
                  } else {
                    // было — пусть восстанваливает пароль
                    res.status(400).send('email exists');
                  }
                }
              });
            } else if (annotator.login === user.login) {
              res.status(400).send('login exists');
            }
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
      if (error) {
        sails.log(error);
      } else {
        if (token) {
          if (token.AID.email === user.email) {
            // удаляем токен
            Tokens.query(`DELETE FROM tokens WHERE token = '${token.token}'`, [], (error, result) => {
              if (error) {
                sails.log(error);
              } else {
                // регистрируем пользователя
                AnnotatorInfo.update(
                  {
                    AID: token.AID.AID,
                  },
                  {
                    registered: 1
                  }
                ).exec((error, updated) => {
                  if (error) {
                    sails.log(error);
                  }
                });

                // отправляем уведомление на почту
                AnnotatorProfile.findOne({
                  AID: token.AID.AID,
                }).exec((error, profile) => {
                  if (error) {
                    sails.log(error);
                  } else {
                    // вынимаем имя пользователя
                    user.firstName = profile.name.split(',')[1].slice(1);
                    // отправляем письмо
                    EmailService.registered(user);
                  }
                });

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
      if (error) {
        sails.log(error);
      } else {
        // обрабатываем ошибки
        if (annotator) {
          if (user.password === annotator.password) {
            // вынимаем дополнительную инфу
            AnnotatorInfo.findOne({ // лучше использовать populate. но не выходить (нужно чтобы sails сам создал таблицу)
              AID: annotator.AID
            }).exec((error, otherInfo) => {
              if (error) {
                sails.log(error);
              } else {
                if (otherInfo.registered) {
                  if (!otherInfo.banned) {
                    // авторизируем пользователя
                    req.session.isAuth = true;
                    req.session.userId = annotator.AID;

                    // сообщаем, когда пользователь в последний раз заходил на сайт
                    updateLastLogin(req.session.userId);

                    if (otherInfo.tutorials === null) {
                      otherInfo.tutorials = [
                        [0, 0, 0],
                        [0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0]
                      ];
                    } else {
                      otherInfo.tutorials = JSON.parse(otherInfo.tutorials);
                    }

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
                      firstTime: otherInfo.firstTime,
                      tutorials: otherInfo.tutorials
                    };

                    // отправляем результат
                    res.json(user);
                  } else {
                    res.status(400).send('banned');
                  }
                } else {
                  res.status(400).send('email is not validated');
                }
              }
            });
          } else {
            res.status(400).send('incorrect password');
          }
        } else {
          res.status(400).send('no email');
        }
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
      if (error) {
        sails.log(error);
      } else {
        if (annotator) {
          // достаём данные аннотатора
          AnnotatorProfile.findOne({
            AID: annotator.AID
          }).exec((error, annotatorProfile) => {
            if (error) {
              sails.log(error);
            } else {
              // разделяем имя и фамилию аннотатора
              const names = annotatorProfile.name.split(',');
              annotator.firstName = names[1];
              annotator.secondName = names[0];

              // генерируем токен и записываем в базу
              annotator.emailToken = CryptoService.generateTokenFromJSON(annotator);

              const doAfterCheckToken = () => {
                // высылаем письмо со ссылкой на страницу смены пароля
                annotator.hostName = req.headers.host;
                EmailService.forgotPassword(annotator);

                // сообщаем об успехе
                res.send('true');
              };

              Tokens.findOne({
                AID: annotator.AID
              }).exec((error, token) => {
                if (error) {
                  sails.log(error);
                } else {
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
                      if (error) {
                        sails.log(error);
                      } else {
                        doAfterCheckToken();
                      }
                    });
                  } else {
                    // токена ещё нет — создаём
                    Tokens.create(
                      {
                        AID: annotator.AID,
                        token: annotator.emailToken
                      }
                    ).exec((error, updated) => {
                      if (error) {
                        sails.log(error);
                      } else {
                        doAfterCheckToken();
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          res.status(400).send('no email');
        }
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
      if (error) {
        sails.log(error);
      } else {
        if (token) {
          if (token.AID.email === user.email) {
            // удаляем токен
            Tokens.query(`DELETE FROM tokens WHERE token = '${user.token}'`, [], (error, result) => {
              if (error) {
                sails.log(error);
              } else {
                // авторизируем пользователя
                req.session.changesPassword = user.email;

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
      if (error) {
        sails.log(error);
      } else {
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
            if (error) {
              sails.log(error);
            } else {
              // проверяем, регистрировался ли пользователь
              AnnotatorInfo.findOne({
                AID: annotator.AID
              }).exec((error, annotatorInfo) => {
                if (error) {
                  sails.log(error);
                } else {
                  // если ещё не регистрировался
                  if (!annotatorInfo) {
                    // регистрируем и создаём таблицу с дополнительной информцией
                    AnnotatorInfo.create({
                      AID: annotator.AID,
                      registered: 1
                    }).exec((error, updated) => {
                      if (error) {
                        sails.log(error);
                      }
                    });
                  }

                  // редактируем сессию
                  req.session.isAuth = true;
                  req.session.userId = annotator.AID;
                  delete req.session.changesPassword

                  // // сообщаем, когда пользователь в последний раз заходил на сайт
                  // updateLastLogin(req.session.userId);

                  // отправляем данные пользователя
                  res.json(annotator);

                  // // перезапускаем сайт
                  // res.redirect('/');
                }
              });
            }
          });
        }
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
      if (error) {
        sails.log(error);
      } else {
        if (annotator) {
          // отправляем результат
          res.json({
            banned: banned
          });
        }
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
      if (error) {
        sails.log(error);
      } else {
        if (annotatorInfo) {
          // сообщаем об успехе
          res.json(true);
        }
      }
    });
  },

  getData: (req, res, next) => {
    // обновляем личные данные аннотатора
    Annotators.findOne({
      AID: req.session.userId
    }).exec((error, annotator) => {
      if (error) {
        sails.log(error);
      } else {
        res.json({
          login: annotator.login,
          email: annotator.email
        });
      }
    });
  },

  updateAccount: (req, res, next) => {
    // // обновляем личные данные аннотатора
    // Annotators.findOne({
    //   AID: req.session.userId
    // }).exec((error, annotator) => {
    //   if (error) {
    //     sails.log(error);
    //   } else {
    //     res.json({
    //       login: annotator.login,
    //       email: annotator.email
    //     });
    //   }
    // });

    res.send('ok');
  },

  feedback: (req, res, next) => {
    EmailService.feedback(req.params.all());
    res.json({});
  }
};