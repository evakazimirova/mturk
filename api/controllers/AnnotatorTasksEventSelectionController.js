/**
 * AnnotatorTasksEventSelectionController
 *
 * @description :: Server-side logic for managing Annotatortaskseventselections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	annoTasks: (req, res, next) => {
    AnnotatorTasksEventSelection.find({
      AID: req.session.userId
    }).populate('TID').exec((error, tasks) => {
      console.log(tasks)
      res.json(tasks);
    });
  },

	take: (req, res, next) => {
    Projects.findOne({
      PID: 2
    }).exec((error, project) => {
      // Если аннотатор подписался на задачу, то стоимость для него фиксируется, и отображается в личном кабинете именно в том размере на который он подписался, даже если администратор для новых аннотаторов увеличил или уменьшил размер выплаты.

      newTask = {
        TID: 1, // это то самое значение должно выбираться неслучайно
        AID: req.session.userId,
        status: 1,
        price: project.pricePerTask
      };

      // берём задачу
      AnnotatorTasksEventSelection.create(newTask, (err, task) => {
        if (err) {
          return next(err);
        } else {
          res.json(task);
        }
      });
    });
  }
};


// проекты, доступные аннотатору
//   // вынимаем все проекты, доступные для аннотатора, кроме тех, которые он уже выполнял и тех, которую сделали 10 раз (для каждой задачи своё значение)
//   // порядок задач: чем меньше людей её делали, тем на более высоком месте она стоит


// взять задачу
//   // если задача не была ранее выполнена аннотатором
//     // проект присваивается пользователю
//     // фиксируется стоимость проекта для этого пользователя
//     // Когда аннотатор в личном кабинете нажимает «нажмите для начала» ему выдается задача по порядку, не случайным образом. То-есть если для задачи 1 установлено количество аннотаторов 10, то задача 2 не выдается пока не будет выдано половина от лимита 5 раз. Таким образом задача 1 будет выдана в 6 ой раз после того как Задача i (последняя) будет выдана 5 раз.


//   // обновляем проект