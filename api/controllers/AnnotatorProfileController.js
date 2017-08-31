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
      if (error) {
        sails.log(error);
      } else {
        AnnotatorInfo.findOne({
          AID: req.session.userId
        }).exec((error, annotatorInfo) => {
          if (error) {
            sails.log(error);
          } else {
            for (const key in annotator) {
              if (annotator[key] == null) {
                delete annotator[key];
              }
            }

            annotator.englishTest = annotatorInfo.englishTest;
            res.json(annotator);
          }
        });
      }
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
      if (error) {
        sails.log(error);
      } else {
        // сообщаем, что анкета заполнена
        AnnotatorInfo.update(
          {
            AID: req.session.userId
          },
          {
            profile: 1
          }
        ).exec((error, annotator) => {
          if (error) {
            sails.log(error);
          }
        });

        res.json(annotator);
      }
    });
  }
};

