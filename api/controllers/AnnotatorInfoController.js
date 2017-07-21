/**
 * AnnotatorInfoController
 *
 * @description :: Server-side logic for managing Annotatorinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  all: (req, res, next) => {
    AnnotatorInfo.find().exec((error, projects) => {
      res.json(projects);
    });
  }
};

