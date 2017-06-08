/**
 * AnnoTasksController
 *
 * @description :: Server-side logic for managing AnnoTasks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	annoTasks: (req, res, next) => {
    AnnoTasks.find({
      AID: req.session.userId,
      status: 1 // активные задачи
    }).populate('TID').exec((error, tasks) => {
      if (tasks) {
        tasksInfo = [];

        for (task of tasks) {
          let emotionsCount;
          if (task.TID.task.length > 0) {
            emotionsCount = task.TID.task.split(',').length;

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
              percentage: part * 100,
              earned: earned,
              price: task.price,
              task: {
                ATID: task.ATID,
                TID: task.TID.TID,
                CID: task.TID.CID,
                task: task.TID.task
              }
            }

            if (task.TID.PID === 1) {
              tasksInfo[0] = taskInfo
            }

            if (task.TID.PID === 2) {
              tasksInfo[1] = taskInfo
            }
          }
        }

        for (let i = 0; i < 2; i++) {
          if (tasksInfo[i] === undefined) {
            tasksInfo[i] = {
              activity: "Inactive",
              percentage: 0,
              earned: 0,
              price: 0,
              task: {
                ATID: 0,
                TID: 0,
                CID: 0,
                task: 0
              }
            }
          }
        }

        res.json(tasksInfo);
      }
    });
  },


	take: (req, res, next) => {
    Projects.findOne({
      PID: 1
    }).exec((error, project) => {
      Tasks.find({
        annoCount: {'<': project.annoPerTask}
      }).populate('annotators').sort('annoCount ASC').exec((error, tasks) => {
        // не даём аннотатору брать одну и ту же задачу
        let foundFreeTask = false;

        for (let task of tasks) {
          if (task.annotators.length === 0) {
            // берём это задание (никто его ещё не брал)
            foundFreeTask = true;
          } else {
            for (let i in task.annotators) {
              if (task.annotators[i].AID === req.session.userId) {
                // это задание аннотатор уже делал
                break;
              }

              if (i === task.annotators.length - 1) {
                // берём это задание
                foundFreeTask = true;
              }
            }
          }

          if (foundFreeTask) {
            // нашли то, что надо. заканчиваем шерстить

            newTask = {
              TID: task.TID, // это то самое значение должно выбираться неслучайно
              AID: req.session.userId,
              price: project.pricePerTask, // Если аннотатор подписался на задачу, то стоимость для него фиксируется, и отображается в личном кабинете именно в том размере на который он подписался, даже если администратор для новых аннотаторов увеличил или уменьшил размер выплаты.
              result: task.csv // определяем разметку аннотируемых кусков
            };

            // берём задачу
            AnnoTasks.create(newTask, (err, annoTask) => {
              if (err) {
                return next(err);
              } else {
                let taskInfo = {
                  activity: "Active",
                  percentage: 0,
                  earned: 0,
                  price: project.pricePerTask,
                  task: {
                    ATID: annoTask.id,
                    TID: task.TID,
                    CID: task.CID,
                    task: task.task
                  }
                };

                // увеличиваем число аннотаторов задачи
                Tasks.findOne({
                  TID: task.TID
                }).exec((error, thisTask) => {
                  const newCount = thisTask.annoCount == null ? 1 : thisTask.annoCount + 1;

                  Tasks.update(
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

            break;
          }
        }

        if (!foundFreeTask) {
          res.json('no free tasks');
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
        AnnoTasks.findOne({
          ATID: ids.ATID
        }).exec((err, annoTask) => {
          all = {
            ATID: ids.ATID,
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
  },


  updateResult: (req, res, next) => {
    let input = req.params.all();

    AnnoTasks.findOne({
      ATID: input.ATID
    }).populate('AID').exec((err, task) => {
      AnnoTasks.update(
        {
          ATID: input.ATID
        },
        {
          result: input.result,
          done: input.done,
          status: 3
        }
      ).exec((err, updated) => {
        const newAmount = task.AID.moneyAvailable + task.price;
        const newRating = task.AID.rating + 1;

        Annotators.update(
          {
            AID: req.session.userId
          },
          {
            moneyAvailable: newAmount,
            rating: newRating
          }
        ).exec((err, updated) => {
          res.json({
            money: newAmount,
            rating: newRating
          });
        });
      });
    });
  }
};

