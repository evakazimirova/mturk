/**
 * MoneyRequestsController
 *
 * @description :: Server-side logic for managing Moneyrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getAll: (req, res, next) => {
    MoneyRequests.find().populate('AID').exec((error, mRequests) => {
      requests = [];
      for (let r of mRequests) {
        requests.push({
          id: r.RID,
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

      res.json(requests);
    });
  },


  send: (req, res, next) => {
    const params = req.params.all();
    params.money = +params.money;

    MoneyRequests.create({
      AID: req.session.userId,
      price: params.money,
      account: params.account,
      system: params.system
    }).exec((error, mReq) => {
      if (mReq) {
        Annotators.findOne({
          AID: req.session.userId
        }).exec((error, annotator) => {
          mReq.AID = annotator;
          mReq.hostName = req.headers.host;
          EmailService.onMoneyRequest(mReq);

          if (params.money <= annotator.moneyAvailable) {
            const moneyAvailable = annotator.moneyAvailable - params.money;

            Annotators.update(
              {
                AID: req.session.userId
              },
              {
                moneyAvailable: moneyAvailable
              }
            ).exec((error, annotator) => {});

            res.json({
              available: moneyAvailable
            });
          } else {
            res.json({error: 'cant request this amount'});
          }
        });
      } else {
        res.json({error: 'error'});
      }
    });
  },
  // send: (req, res, next) => {},
};


// новый запрос на выдачу средств
//   // добавляем запрос в базу данных
//     // если всё ок, то
//       // отправляем уведомление на почту администратора
//       // сообщаем пользователю о том, что всё ок
//     // если не ок, то
//       // сообщаем пользователю о том, что всё не ок


// показать все запросы
  // // вынимаем все поступившие вопросы о выводе средств
  // query = {
  //   cols: '*'
  // };
  // db.select('MoneyRequests', query, (rData) => {
  //   for (r of rData) {
  //     query = {
  //       cols: '*',
  //       where: `AID = '${r.AID}'`
  //     };
  //     db.select('Annotators', query, (aData) => {

  //       response.send(JSON.stringify(data)); // отправляем данные
  //     });

  //     // собираем информацию по проектам
  //     user.projects = 2;
  //     user.completed = 7;
  //     user.progress = [
  //       50,
  //       83
  //     ];
  //   }
  // });


// обновление запоса
//   // обновляем выбранный запрос