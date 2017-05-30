/**
 * MoneyRequestsController
 *
 * @description :: Server-side logic for managing Moneyrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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