/**
 * AnnotatorTasksMarkUPController
 *
 * @description :: Server-side logic for managing Annotatortasksmarkups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	annoTasks: (req, res, next) => {
    AnnotatorTasksMarkUP.find({
      AID: req.session.userId
    }).exec((error, tasks) => {
      res.json(tasks);
    });
  },

	take: (req, res, next) => {
    Projects.findOne({
      PID: 1
    }).exec((error, project) => {
      // Если аннотатор подписался на задачу, то стоимость для него фиксируется, и отображается в личном кабинете именно в том размере на который он подписался, даже если администратор для новых аннотаторов увеличил или уменьшил размер выплаты.

      newTask = {
        TID: 1, // это то самое значение должно выбираться неслучайно
        AID: req.session.userId,
        status: 1,
        price: project.pricePerTask
      };

      // берём задачу
      AnnotatorTasksMarkUP.create(newTask, (err, task) => {
        if (err) {
          return next(err);
        } else {
          res.json(task);
        }
      });
    });
  }
};

