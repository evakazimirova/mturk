/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getAll: (req, res, next) => {
    Projects.find().exec((error, projects) => {
      for (let project of projects) {
        project.taskTypes = [
          {
            title: 'Standard Task (Piece of Cake)',
            price: project.pricePerTask,
            tasksAmount: 1
          },
          {
            title: 'Extended Task (Great Job)',
            price: project.pricePerTaskMedium,
            tasksAmount: 3
          },
          {
            title: 'Jedi Master Only (Damn I’m Good)',
            price: project.pricePerTaskHard,
            tasksAmount: 10
          }
        ];

        delete project.pricePerTask;
        delete project.pricePerTaskMedium;
        delete project.pricePerTaskHard;
      }

      res.json(projects);
    });
  }
};

