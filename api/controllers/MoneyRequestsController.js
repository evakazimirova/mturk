/**
 * MoneyRequestsController
 *
 * @description :: Server-side logic for managing Moneyrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // достаём все запросы на выдачу денежных средств
  getAll: (req, res, next) => {
    MoneyRequests.find().populate('AID').exec((error, mRequests) => {
      if (error) {
        sails.log(error);
      } else {
        // формируем ответ
        requests = [];
        for (let r of mRequests) {
          requests.push({
            RID: r.RID,
            date: r.createdAt,
            user: {
              firstName: r.AID.firstName,
              secondName: r.AID.secondName,
              email: r.AID.email,
              phone: '+7 (926) 123-45-67'
            },
            bill: {
              amount: r.price,
              method: r.system,
              account: r.account,
              isDefrayed: r.defrayed
            }
          });
        }

        // отправляем результат
        res.json(requests);
      }
    });
  },


  // отправка запроса на вывод средств
  send: (req, res, next) => {
    // запоминаем данные запроса
    const params = req.params.all();
    params.money = +params.money; // переводим текст в число

    // создаём новую запись в БД
    MoneyRequests.create({
      AID: req.session.userId,
      price: params.money,
      account: params.account,
      system: params.system
    }).exec((error, mReq) => {
      if (error) {
        sails.log(error);
      } else {
        if (mReq) {
          // достаём данные аннотатора
          AnnotatorInfo.findOne({
            AID: req.session.userId
          }).exec((error, annotator) => {
            if (error) {
              sails.log(error);
            } else {
              // отправляем письмо администраторам
              mReq.AID = annotator;
              mReq.hostName = req.headers.host;

              // отправляем уведомления на почту
              Annotators.findOne({
                AID: req.session.userId
              }).exec((error, user) => {
                if (error) {
                  sails.log(error);
                } else {
                  AnnotatorProfile.findOne({
                    AID: req.session.userId
                  }).exec((error, profile) => {
                    if (error) {
                      sails.log(error);
                    } else {
                      // вынимаем имя пользователя
                      mReq.AID.name = profile.name;
                      const name = profile.name.split(',');
                      if (name.length === 1) {
                        mReq.AID.firstName = name;
                      } else if (name.length === 2) {
                        mReq.AID.firstName = name[1].slice(1);
                      }
                      mReq.AID.email = user.email;
                      // отправляем письма
                      EmailService.moneyRequest(mReq);
                      EmailService.moneyRequestAlert(mReq.AID);
                    }
                  });
                }
              });

              // следим за тем, чтобы сумма запроса не превышала доступный баланс
              if (params.money <= annotator.moneyAvailable) {
                // обновляем баланс аннотатора
                const moneyAvailable = annotator.moneyAvailable - params.money;
                AnnotatorInfo.update(
                  {
                    AID: req.session.userId
                  },
                  {
                    moneyAvailable: moneyAvailable
                  }
                ).exec((error, annotator) => {
                  if (error) {
                    sails.log(error);
                  }
                });

                // отправляем новый баланс аннотатора
                res.json({
                  available: moneyAvailable
                });
              } else {
                res.json({error: 'cant request this amount'});
              }
            }
          });
        } else {
          res.json({error: 'error'});
        }
      }
    });
  },


  // подтверждение оплаты работы аннотатора
  defray: (req, res, next) => {
    // запоминаем данные запроса
    const params = req.params.all();
    params.defrayed = params.defrayed == 'true'; // преобразуем текст в булево значение

    // обновляем статус запроса на деньги
    MoneyRequests.update(
      {
        RID: params.RID
      },
      {
        defrayed: params.defrayed
      }
    ).exec((error, mReq) => {
      if (error) {
        sails.log(error);
      } else {
        // отправляем результат
        res.json({defrayed: params.defrayed});
      }
    });
  }
};