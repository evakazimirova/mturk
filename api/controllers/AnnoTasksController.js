/**
 * AnnoTasksController
 *
 * @description :: Server-side logic for managing AnnoTasks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let uniq = a => [...new Set(a)];

module.exports = {
  // вынимаем задачи аннотатора
	annoTasks: (req, res, next) => {
    // вынимаем все активные задачи аннотатора
    AnnoTasks.find({
      AID: req.session.userId,
      status: 1 // активные задачи
    }).populate('TID').exec((error, tasks) => {
      if (tasks) {
        tasksInfo = [];

        for (task of tasks) {
          // количество взятых задач
          const tasksCount = Object.keys(JSON.parse(task.TID.FID)).length;

          // прогресс
          const part = +(task.done / tasksCount).toFixed(2);
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

          // собираем всю инфу
          const taskInfo = {
            activity: activity,
            percentage: part * 100,
            earned: earned,
            price: task.price,
            task: {
              PID: task.TID.PID,
              ATID: task.ATID,
              TID: task.TID.TID,
              HID: task.TID.HID
            }
          }

          // засовываем данные в массив всех задач
          tasksInfo[task.TID.PID - 1] = taskInfo;
        }

        // отправляем результат
        res.json(tasksInfo);
      }
    });
  },


  // взять задачу
	take: (req, res, next) => {
    // достаём все доступные задачи и сортируем по приоритету
    Tasks.find({PID: req.param('PID')})
      .populateAll()
      .sort('annoCount ASC')
      .exec((error, tasks) => {
      // не даём аннотатору брать одну и ту же задачу
      let foundFreeTask = false;

      for (let task of tasks) {
        // выбираем только те задачи, для которых ещё не набрано максимальное количество аннотаторов
        if (task.annoCount <= task.PID.annoPerTask) {
          if (task.annoTasks.length === 0) {
            // берём это задание (никто его ещё не брал)
            foundFreeTask = true;
          } else {
            for (let i in task.annoTasks) {
              if (task.annoTasks[i].AID === req.session.userId) {
                // это задание аннотатор уже делал
                break;
              } else if (Number(i) === Number(task.annoTasks.length - 1)) {
                // берём это задание
                foundFreeTask = true;
              }
            }
          }
        }

        if (foundFreeTask) {
          // нашли то, что надо. заканчиваем шерстить

          newTask = {
            TID: task.TID, // это то самое значение должно выбираться неслучайно
            AID: req.session.userId,
            price: task.PID.pricePerTask, // фиксируем стоимость задачи для аннотатора
            result: task.FID.csv, // определяем разметку аннотируемых кусков
            deadline: new Date(+new Date + 12096e5) // дедлайн — через 2 недели
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
                price: task.PID.pricePerTask,
                task: {
                  PID: task.PID.PID,
                  ATID: annoTask.ATID,
                  TID: task.TID,
                  HID: task.FID.HID,
                  taken: +req.param('index') + 1
                }
              };

              // назначаем пользователю задачу
              AnnotatorInfo.update(
                {
                  AID: req.session.userId
                },
                {
                  taskTaken: +req.param('index') + 1
                }
              ).exec((err, updated) => {
                if (err) {
                  console.log(err);
                }
              });

              // увеличиваем число аннотаторов задачи
              Tasks.update(
                {
                  TID: task.TID
                },
                {
                  annoCount: task.annoCount == null ? 1 : task.annoCount + 1
                }
              ).exec((err, updated) => {
                if (err) {
                  console.log(err);
                }
              });

              // отправляем результат
              res.json(taskInfo);
            }
          });
          break;
        }
      }

      // сообщаем, что нет доступны задач для аннотатора
      if (!foundFreeTask) {
        res.json('no free tasks');
      }
    });
  },


  // начать выполнять задачу
  start:  (req, res, next) => {
    // запоминаем данные запроса
    let ids = req.params.all();

    // вынимаем сохранённую работу аннотатора
    AnnoTasks.findOne({
      ATID: ids.ATID
    }).populateAll().exec((err, annoTask) => {
      // вынимаем эмоции для разметки
      Tasks.findOne({
        TID: ids.TID
      }).populateAll().exec((err, task) => {
        let all = {};

        // Парсим задачу
        all.FIDs = JSON.parse(task.FID);

        // формируем задание по эмоциям
        let allEmotions = [];
        let allFIDs = [];
        for (const fid of all.FIDs) {
          allFIDs.push({FID: fid.FID});
          fid.emotions = fid.emotions.split(',').map((E) => {return +E.slice(-1);});
        }

        // можно упростить запрос в БД
        // console.log(uniq(allFIDs));

        // достаём фрагменты для задачи из БД
        Fragments.find({
          or: allFIDs
        }).populateAll().exec((err, fragments) => {
          all.ATID = ids.ATID;

          // если есть сохранения, достаём
          let savesExist = false;
          let result = [];
          if (annoTask.result !== null) {
            savesExist = true;
            result = JSON.parse(annoTask.result);
          }

          // формируем ответ из сохранений или без
          for (const f of fragments) {
            for (const fid in all.FIDs) {
              if (all.FIDs[fid].FID === f.FID) {
                all.FIDs[fid].video = f.VID.URL;
                if (savesExist) {
                  if (result[fid] !== null) {
                    all.FIDs[fid].result = result[fid];
                    all.FIDs[fid].done = true;
                  } else {
                    all.FIDs[fid].result = {
                      FID: f.FID,
                      csv: f.csv
                    };
                    all.FIDs[fid].done = false;
                  }
                } else {
                  all.FIDs[fid].result = {
                    FID: f.FID,
                    csv: f.csv
                  };
                  all.FIDs[fid].done = false;
                }
              }
            }
          }

          // отправляем результат
          res.json(all);
        });
      });
    });
  },


  // сохраняем разметку
  save: (req, res, next) => {
    // запоминаем данные запроса
    let input = req.params.all();

    // вынимаем данные задачи
    AnnoTasks.findOne({
      ATID: input.ATID
    }).populate('AID').exec((err, task) => {
      // сохраняем результат в БД
      AnnoTasks.update(
        {
          ATID: input.ATID
        },
        {
          result: JSON.stringify(input.result),
          done: input.done
          // status: 3 // заканчиваем выполнение задачи
        }
      ).exec((err, updated) => {
        // формируем новые баланс и рейтинг пользователя
        const newAmount = task.AID.moneyAvailable + task.price;
        const newRating = task.AID.rating + 1;

        // обновляем баланс и рейтинг пользователя
        AnnotatorInfo.update(
          {
            AID: req.session.userId
          },
          {
            moneyAvailable: newAmount,
            rating: newRating
          }
        ).exec((err, updated) => {
          // отдаём текущий баланс и рейтинг
          res.json({
            money: newAmount,
            rating: newRating
          });
        });
      });
    });
  }
};