/**
 * AnnotatorInfoController
 *
 * @description :: Server-side logic for managing Annotatorinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  all: (req, res, next) => {
    AnnotatorInfo.find().exec((error, aInfo) => {
      if (error) {
        sails.log(error);
      } else {
        res.json(aInfo);
      }
    });
  },

  passEnglishTest: (req, res, next) => {
    const englishTest = req.param('rightTotal') > 1 ? 'YES' : 'BAD';

    AnnotatorInfo.update(
      {
        AID: req.session.userId
      },
      {
        englishTest: englishTest,
        englishTestMark: req.param('rightTotal')
      }
    ).exec((error, aInfo) => {
      if (error) {
        sails.log(error);
      } else {
        res.json({englishTest: englishTest});
      }
    });
  },

  saveTutorial: (req, res, next) => {
    AnnotatorInfo.update(
      {
        AID: req.session.userId
      },
      {
        tutorials: JSON.stringify(req.param('tutorials'))
      }
    ).exec((error, aInfo) => {
      if (error) {
        sails.log(error);
      } else {
        // проверяем, все ли туториалы пройдены
        let allTutorialsDone = true;
        for (let group of req.param('tutorials')) {
          if (!allTutorialsDone) {
            break;
          }
          for (let tutorial of group) {
            if (tutorial === 0) {
              allTutorialsDone = false;
              break;
            }
          }
        }

        if (allTutorialsDone) {
          // отправляем уведомление на почту
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
                  const name = profile.name.split(',');
                  if (name.length === 1) {
                    user.firstName = name;
                  } else if (name.length === 2) {
                    user.firstName = name[1].slice(1);
                  }
                  // отправляем письмо
                  EmailService.testsFinished(user);
                }
              });
            }
          });
        }

        res.json(aInfo[0]);
      }
    });
  }
};

