/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getAll: (req, res, next) => {
    Projects.find().exec((error, projects) => {
      res.json(projects);
    });
  }
};

