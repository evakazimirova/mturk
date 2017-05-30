/**
 * AnnotatorController
 *
 * @description :: Server-side logic for managing Annotators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // авторизован ли пользователь
  authorized: (req, res, next) => {
    res.send('false');
  },

  add: (req, res, next) => {
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

  withTasks: (req, res, next) => {
    Annotators.find().populateAll().exec((error, annotators) => {
      console.log(annotators);
      res.json(annotators);
    });
  }
};

