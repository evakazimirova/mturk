/**
 * AnnotatorTasksMarkUPController
 *
 * @description :: Server-side logic for managing Annotatortasksmarkups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	annoTask: (req, res, next) => {
    AnnotatorTasksMarkUP.findOne({
      AID: req.session.userId,
      status: 1 // активные задачи
    }).populate('TID').exec((error, task) => {
      if (task) {
        let emotionsCount;
        if (task.TID.emotions.length > 0) {
          emotionsCount = task.TID.emotions.split(',').length;

          const part = +(task.done / emotionsCount).toFixed(0);
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
          res.json({error: "no emotions"});
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
      PID: 1
    }).exec((error, project) => {
      // Если аннотатор подписался на задачу, то стоимость для него фиксируется, и отображается в личном кабинете именно в том размере на который он подписался, даже если администратор для новых аннотаторов увеличил или уменьшил размер выплаты.

      newTask = {
        TID: 1, // это то самое значение должно выбираться неслучайно
        AID: req.session.userId,
        price: project.pricePerTask
      };

      // берём задачу
      AnnotatorTasksMarkUP.create(newTask, (err, task) => {
        if (err) {
          return next(err);
        } else {
          const taskInfo = {
            activity: "Active",
            video: 'sharapova',
            percentage: 0,
            earned: 0,
            price: project.pricePerTask,
          };

          // увеличиваем число аннотаторов задачи
          TasksMarkUP.findOne({
            TID: task.TID
          }).exec((error, thisTask) => {
            const newCount = thisTask.annoCount == null ? 1 : thisTask.annoCount + 1;
            TasksMarkUP.update(
              {
                TID: task.TID
              },
              {
                annoCount: newCount
              }
            ).exec((err, updated) => {
              if (err) {
                console.log(err);
              } else {
                console.log(updated);
              }
            });
          });

          res.json(taskInfo);
        }
      });
    });
  },


  start:  (req, res, next) => {
    let ids = req.params.all();

    let emotions = [];
    for (let e of ids.emotions.split(',')) {
      emotions.push({
        EID: e,
      });
    }

    // вынимаем эмоции для разметки
    // (!) можно сделать синхронно
    EmotionInfo.find({
      or: emotions
    }).exec((err, emotions) => {
      PersonSelection.findOne({
        CID: ids.CID
      }).populate('VID').exec((err, person) => {
        AnnotatorTasksMarkUP.findOne({
          ATID: ids.ATID
        }).exec((err, annoTask) => {
          all = {
            video: person.VID.URL,
            person: {
              name: person.personName,
              image: person.personImage
            },
            emotions: emotions,
            result: annoTask.result === null ? '' : annoTask.result
          };

          res.json(all);
        });
      });
    });
  }
};

