/**
 * AnnotatorProfileController
 *
 * @description :: Server-side logic for managing Annotatorprofiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getData: (req, res, next) => {
    // обновляем личные данные аннотатора
    AnnotatorProfile.findOne({
      AID: req.session.userId
    }).exec((error, annotator) => {
      for (const key in annotator) {
        if (annotator[key] == null) {
          delete annotator[key];
        }
      }

      res.json(annotator);
    });
  },

	update: (req, res, next) => {
    // запоминаем данные запроса
    let user = req.params.all();

    // обновляем личные данные аннотатора
    AnnotatorProfile.update(
      {
        AID: req.session.userId
      },
      req.params.all()
    ).exec((error, annotator) => {
      // сообщаем, что анкета заполнена
      AnnotatorInfo.update(
        {
          AID: req.session.userId
        },
        {
          profile: 1
        }
      ).exec((error, annotator) => {});

      res.json(annotator);
    });
  }
};

