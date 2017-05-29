/**
 * AnnotatorController
 *
 * @description :: Server-side logic for managing Annotators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  authorized: function(req, res, next) {
    res.send('false');
  },

  add: function(req, res, next) {
    console.log(req.params.all());

    // Annotators.create(req.params.all(), function (err, annotator) {
    //   if (err) return next(err);
    // });
  }

	// router.route('/up')
  // .post(parseJSON, function(request, response){
  //   const newUser = request.body; // принимаем данные

  //   if (newUser.email === "") {
  //     response.status(400).send('no email');
  //   } else {
  //     // проверяем, есть ли такой пользователь
  //     query = {
  //       cols: 'email, login',
  //       where: `email = '${newUser.email}' OR login = '${newUser.login}'`
  //     };
  //     db.select('Annotators', query, (data) => {
  //       if (data.length > 0) {
  //         if (data[0].login === newUser.login) {
  //           console.log("Annotator with this login is already exists in the system.");
  //           response.status(400).send('login exists');
  //         }
  //         if (data[0].email === newUser.email) {
  //           console.log("Annotator with this email is already exists in the system.");
  //           response.status(400).send('user exists');
  //         }
  //       } else {
  //         console.log("Adding a new annotator...");
  //         // шифруем пароль
  //         newUser.password = h.encryptPassword(newUser.password);

  //         // генерируем токен
  //         const emailToken = h.generateTokenFromJSON(newUser);
  //         newUser.emailToken = emailToken;

  //         // регистрируем аннотатора
  //         db.insert('Annotators', newUser);

  //         // отправляем оповещение на почту новому аннотатору
  //         mailer.onSignUp(newUser);

  //         response.send(JSON.stringify({email: newUser.email})); // отправляем данные
  //       }
  //     });
  //   }
  // });
};

