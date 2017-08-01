/**
 * AnnotatorInfoController
 *
 * @description :: Server-side logic for managing Annotatorinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  all: (req, res, next) => {
    AnnotatorInfo.find().exec((error, aInfo) => {
      res.json(aInfo);
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
      res.json({englishTest: englishTest});
    });
  }
};

