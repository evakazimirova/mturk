/**
 * MoneyRequestsController
 *
 * @description :: Server-side logic for managing Moneyrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

};


// typicalPostRequest('/post', function(user) {
//   // добавляем запрос в базу данных
//     // если всё ок, то
//       // отправляем уведомление на почту администратора
//       // сообщаем пользователю о том, что всё ок
//     // если не ок, то
//       // сообщаем пользователю о том, что всё не ок

//   res = user;
//   return res;
// });

// router.route('/get')
//     .get(function(request, response){
//       // вынимаем все поступившие вопросы о выводе средств
//       query = {
//         cols: '*'
//       };
//       db.select('MoneyRequests', query, (rData) => {
//         for (r of rData) {
//           query = {
//             cols: '*',
//             where: `AID = '${r.AID}'`
//           };
//           db.select('Annotators', query, (aData) => {

//             response.send(JSON.stringify(data)); // отправляем данные
//           });




//           // собираем информацию по проектам
//           user.projects = 2;
//           user.completed = 7;
//           user.progress = [
//             50,
//             83
//           ];
//         }
//       });
//     });


// typicalPostRequest('/update/:requestID', function(user) {
//   // обновляем выбранный запрос

//   res = user;
//   return res;
// });