/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // достаём все проекты
  getAll: (req, res, next) => {
    Projects.find().exec((error, projects) => {
      for (let project of projects) {
        // формируем для каждого проекта 3 сущности, содержащие задачи
        project.taskTypes = [
          {
            title: 'Standard Task (Piece of Cake)',
            price: project.pricePerTask,
            tasksAmount: 1,
            EWT: project.EWT
          },
          {
            title: 'Extended Task (Great Job)',
            price: project.pricePerTaskMedium,
            tasksAmount: 3,
            EWT: project.EWT * 3
          },
          {
            title: 'Jedi Master Only (Damn I’m Good)',
            price: project.pricePerTaskHard,
            tasksAmount: 10,
            EWT: project.EWT * 10
          }
        ];

        // избавляемся от лишней информации
        delete project.pricePerTask;
        delete project.pricePerTaskMedium;
        delete project.pricePerTaskHard;
      }

      // отправляем результат
      res.json(projects);
    });
  }
};

