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
      if (error) {
        sails.log(error);
      } else {
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
      }
    });
  },


  // взять задачу
	take: (req, res, next) => {
    let tasksAmount = 1;

    // назначаем нужное количество задач
    switch (+req.param('index')) {
      case 0:
        tasksAmount = 1;
        break;
      case 1:
        tasksAmount = 3;
        break;
      case 2:
        tasksAmount = 10;
        break;
    }

    // достаём все доступные задачи и сортируем по приоритету
    Tasks.find({
      PID: req.param('PID')
    }).populateAll().sort('annoCount ASC').exec((error, tasks) => {
      if (error) {
        sails.log(error);
      } else {
        // фильтруем задачи
        for (let t in tasks) {
          if (tasks[t].annoCount < tasks[t].PID.annoPerTask) {
            // убираем те задачи, которые аннотатор уже делал
            if (tasks[t].annoTasks.length !== 0) {
              for (let i in tasks[t].annoTasks) {
                if (tasks[t].annoTasks[i].AID === req.session.userId) {
                  tasks.splice(t, 1); // убираем из списка доступных
                  break;
                }
              }
            }
          } else {
            // убираем задачи, которые разметило достаточное количество аннотаторов
            tasks.splice(t);
            break;
          }
        }

        if (tasksAmount <= tasks.length) {
          // отдаём только эти задачи
          tasks.splice(tasksAmount);

          let sendRequest = true;
          for (let task of tasks) {
            // формируем задачу
            newTask = {
              TID: task.TID, // это то самое значение должно выбираться неслучайно
              AID: req.session.userId,
              price: task.PID.pricePerTask, // фиксируем стоимость задачи для аннотатора
              result: task.FID.csv, // определяем разметку аннотируемых кусков
              deadline: new Date(+new Date + 12096e5) // дедлайн — через 2 недели
            };

            // берём задачи
            AnnoTasks.create(newTask).exec((error, annoTask) => {
              if (error) {
                sails.log(error);
              } else {
                // увеличиваем число аннотаторов задачи
                Tasks.update(
                  {
                    TID: task.TID
                  },
                  {
                    annoCount: task.annoCount == null ? 1 : task.annoCount + 1
                  }
                ).exec((error, updatedTask) => {
                  if (error) {
                    sails.log(error);
                  }
                });

                // отправляем запрос по первой задаче
                if (sendRequest) {
                  sendRequest = false;

                  // назначаем пользователю задачу
                  AnnotatorInfo.update(
                    {
                      AID: req.session.userId
                    },
                    {
                      taskTaken: +req.param('index') + 1
                    }
                  ).exec((error, updated) => {
                    if (error) {
                      sails.log(error);
                    }
                  });

                  // формируем ответ
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

                  // отправляем результат
                  res.json(taskInfo);
                }
              }
            });
          }
        } else {
          // сообщаем, что нет доступных задач для аннотатора
          res.json('no free tasks');
        }
      }
    });
  },


  // начать выполнять задачу
  start: (req, res, next) => {
    // запоминаем данные запроса
    let ids = req.params.all();

    // вынимаем сохранённую работу аннотатора
    AnnoTasks.findOne({
      ATID: ids.ATID
    }).populateAll().exec((error, annoTask) => {
      if (error) {
        sails.log(error);
      } else {
        // вынимаем эмоции для разметки
        Tasks.findOne({
          TID: ids.TID
        }).populateAll().exec((error, task) => {
          if (error) {
            sails.log(error);
          } else {
            let all = {
              done: annoTask.done
            };

            // Парсим задачу
            all.FIDs = JSON.parse(task.FID);

            // формируем задание по эмоциям
            let allEmotions = [];
            let allFIDs = [];
            for (const fid of all.FIDs) {
              allFIDs.push({FID: fid.FID});
              fid.emotions = fid.emotions.split(',').map((E) => {return +E.slice(1);});
            }

            // можно упростить запрос в БД
            // console.log(uniq(allFIDs));

            // достаём фрагменты для задачи из БД
            FragmentsModerate.find({
              or: allFIDs
            }).populateAll().exec((error, fragments) => {
              if (error) {
                sails.log(error);
              } else {
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
              }
            });
          }
        });
      }
    });
  },


  // сохраняем разметку
  save: (req, res, next) => {
    // запоминаем данные запроса
    let input = req.params.all();

    isTaskEnded = input.done === input.total;

    // вынимаем данные задачи
    AnnoTasks.findOne({
      ATID: input.ATID
    }).exec((error, task) => {
      if (error) {
        sails.log(error);
      } else {
        AnnotatorInfo.findOne({
          AID: task.AID
        }).exec((error, annotatorInfo) => {
          if (error) {
            sails.log(error);
          } else {
            // сохраняем результат в БД
            AnnoTasks.update(
              {
                ATID: input.ATID
              },
              {
                result: JSON.stringify(input.result),
                done: input.done,
                status: isTaskEnded ? 3 : 1 // заканчиваем выполнение задачи, если всё сделано
              }
            ).exec((error, updated) => {
              if (error) {
                sails.log(error);
              } else {
                let newAmount, newRating;
                if (isTaskEnded) {
                  // формируем новые баланс и рейтинг пользователя
                  newAmount = annotatorInfo.moneyAvailable + task.price;
                  newRating = annotatorInfo.rating + 1;
                } else {
                  // оставляем баланс и рейтинг прежним
                  newAmount = annotatorInfo.moneyAvailable;
                  newRating = annotatorInfo.rating;
                }

                // обновляем баланс и рейтинг пользователя
                AnnotatorInfo.update(
                  {
                    AID: req.session.userId
                  },
                  {
                    moneyAvailable: newAmount,
                    rating: newRating
                  }
                ).exec((error, updated) => {
                  if (error) {
                    sails.log(error);
                  } else {
                    if (input.done === input.total) {
                      // выясняем, есть ли ещё неоконченные задачи
                      AnnoTasks.find({
                        AID: req.session.userId,
                        status: 1
                      }).exec((error, tasks) => {
                        if (error) {
                          sails.log(error);
                        } else {
                          if (tasks.length === 0) {
                            // повышаем уровень аннотатора, если достиг его
                            levelUp = annotatorInfo.level === annotatorInfo.taskTaken ? annotatorInfo.level + 1 : annotatorInfo.level

                            // снимаем задачу с пользователя
                            AnnotatorInfo.update(
                              {
                                AID: task.AID
                              },
                              {
                                taskTaken: null,
                                level: levelUp
                              }
                            ).exec((error, updated) => {
                              if (error) {
                                sails.log(error);
                              }
                            });

                            // отдаём текущий баланс и рейтинг
                            res.json({
                              money: newAmount,
                              rating: newRating,
                              taskTaken: undefined,
                              level: levelUp
                            });
                          } else {
                            // отдаём текущий баланс и рейтинг
                            res.json({
                              money: newAmount,
                              rating: newRating,
                              taskTaken: 2
                            });
                          }
                        }
                      });
                    } else {
                      // отдаём текущий баланс и рейтинг
                      res.json({
                        money: newAmount,
                        rating: newRating,
                        taskTaken: 2
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  },

  giveUp: (req, res, next) => {
    AnnoTasks.update(
      {
        AID: req.session.userId,
        status: 1
      },
      {
        status: 2
      }
    ).exec((error, refusedTasks) => {
      if (error) {
        sails.log(error);
      } else {
        AnnotatorInfo.update(
          {
            AID: req.session.userId,
          },
          {
            taskTaken: null
          }
        ).exec((error, updated) => {
          if (error) {
            sails.log(error);
          } else {
            // отправляем уведомление на почту
            Annotators.findOne({
              AID: req.session.userId
            }).exec((error, user) => {
              if (error) {
                sails.log(error);
              } else {
                AnnotatorProfile.findOne({
                  AID: req.session.userId
                }).exec((error, profile) => {
                  if (error) {
                    sails.log(error);
                  } else {
                    // вынимаем имя пользователя
                    const name = profile.name.split(',');
                    if (name.length === 1) {
                      user.firstName = name;
                    } else if (name.length === 2) {
                      user.firstName = name[1].slice(1);
                    }

                    // отправляем письмо
                    EmailService.taskRefusal(user);
                  }
                });
              }
            });

            // if (refusedTasks.length === 1) {

            // } else if (refusedTasks.length > 1) {

            // }

            res.json({});
          }
        });
      }
    });
  }
};