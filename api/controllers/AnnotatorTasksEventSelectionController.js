/**
 * AnnotatorTasksEventSelectionController
 *
 * @description :: Server-side logic for managing Annotatortaskseventselections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	annoTask: (req, res, next) => {
    AnnotatorTasksEventSelection.findOne({
      AID: req.session.userId,
      status: 1 // активные задачи
    }).populate('TID').exec((error, task) => {
      if (task) {
        let eventsCount;
        if (task.TID.events.length > 0) {
          eventsCount = task.TID.events.split(',').length;

          const part = +(task.done / eventsCount).toFixed(0);
          const earned = +(part * task.price).toFixed(0);

          let activity;

          switch (task.status) {
            case 1:
              activity = "Active";
              break;

            default:
              activity = "Inactive";
              break;
          }

          const taskInfo = {
            activity: activity,
            video: 'sharapova',
            percentage: part * 100,
            earned: earned,
            price: task.price,
          }

          res.json(taskInfo);
        } else {
          res.json({error: "no events"});
        }
      } else {
        const taskInfo = {
          activity: "Inactive",
          video: 'sharapova',
          percentage: 0,
          earned: 0,
          price: 0,
        }

        res.json(taskInfo);
      }
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