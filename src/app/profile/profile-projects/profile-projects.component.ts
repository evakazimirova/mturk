import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { AnnotatingService } from '../annotating/annotating.service';

@Component({
  selector: 'na-profile-projects',
  templateUrl: './profile-projects.component.html',
  styleUrls: ['./profile-projects.component.scss']
})
export class ProfileProjectsComponent implements OnInit {
  @Output() startAnnotating = new EventEmitter();

  // для индикаторов загрузки
  isLoaded = true;
  loadingTask = -1;
  areTutorialsFinished = false;
  isGivingUp = false;

  constructor(public common: CommonService,
              private http: HttpService,
              public annot: AnnotatingService) { }

  ngOnInit() {
    this.common.progressBar = [
      {
        action: 'Login',
        done: true,
        go: () => {
          // console.log('confirm');
        }
      },
      {
        action: 'Do Demo-Task and Get Your 1$',
        done: this.common.user.demo === 1,
        go: () => {
          this.startDemoTask();
        }
      },
      {
        action: 'Fill Your Profile',
        done: this.common.user.profile === 1 && this.common.user.englishTest !== 'NO',
        go: () => {
          this.common.profileMode = 'profile';
        }
      },
      {
        action: 'Pass English Test',
        done: this.common.user.englishTest !== 'NO',
        go: () => {
          $('.english-test-modal').modal('show');
        }
      },
      {
        action: 'Take a Tutorial',
        done: this.checkTutorials(),
        go: () => {
          this.common.profileMode = 'profile';
        }
      },
      {
        action: 'Finish Tasks and Get Money',
        done: false,
        go: () => {
          this.common.profileMode = 'withdrawal';
        }
      }
    ];

    // загружаем данные только один раз при входе
    if (this.common.projects.length === 0) {
      this.isLoaded = false;
      this.http.get('Projects/getAll').subscribe(
        projects => {
          // обновляем список проектов
          this.common.projects = projects;

          this.http.get('AnnoTasks/annoTasks').subscribe(
            tasks => {
              this.isLoaded = true;

              if (tasks.length > 0) {
                // обновляем проекты, которые делал пользователь
                for (const p in this.common.projects) {
                  this.common.projects[p].annoTask = tasks[p];
                }

                // Считаем зарезервиродванную сумму
                this.common.user.money.reserved = 0;
                for (const task of tasks) {
                  this.common.user.money.reserved = +task.price;
                }
              }
            },
            error => {
              this.isLoaded = true;
              console.error(error);
            }
          );
        },
        error => {
          this.isLoaded = true;
          console.error(error);
        }
      );
    }
  }

  // решаем, что делать с выбранной задачей
  taskSelected(project, i) {
    if (!this.isGivingUp) {
      if (this.common.user.profile === 0) {
        this.common.alert('Before you will continue you should fill all the required information about you in your profile.');
      } else if (this.common.user.taskTaken !== null && i !== this.common.user.taskTaken - 1) {
        this.common.alert('Sorry, but you have already taken a task. Please finnish it first and you will be able take one more.');
      } else if (i >= this.common.user.level) {
        this.common.alert('Sorry, but you are not ready to do this type of tasks. Please finnish the previous type of task first.');
      } else if (i !== 0 && !this.checkTutorials()) {
        this.common.alert('Before taking this task you should pass all the tutorials.');
      } else {
        // пока обрабатывается одна задача, другую брать нельзя
        if (this.loadingTask === -1) {
          // сообщаем, что обрабатываем эту задачу
          this.loadingTask = i;

          if (project.annoTask) {
            // Продолжить выполнение
            this.startTask(project.annoTask.task);
          } else {
            // Дать задачу или запретить
            this.takeTask(project.PID, i);
          }
        }
      }
    }
  }

  checkTutorials() {
    const sum = (array) => {
      let sum = 0;
      for (let i of array) {
        sum += i;
      }
      return sum;
    };

    for (const test of this.common.user.tutorials) {
      if (sum(test) === 0) {
        return false;
      }
    }

    return true;
  }

  // начать выполнение задачи
  startTask(ids) {
    const startTask = () => {
      this.http.post(ids, 'AnnoTasks/start').subscribe(
        task => {
          this.loadingTask = -1;

          // обновляем данные задачи
          this.annot.task = task;
          this.annot.task.FIDsList = Object.keys(task.FIDs);
          this.annot.FID = this.annot.task.FIDsList[task.done];

          // запускаем режим аннотирования и включаем видео
          this.startAnnotating.emit();
          this.annot.setVideo();
        },
        error => {
          this.loadingTask = -1;
          console.error(error);
        }
      );
    };

    // вынимаем все эмоции
    if (this.annot.emotions.length === 0) {
      this.http.get('EmotionsInfo/getAll').subscribe(
        emotions => {
          this.annot.emotions = emotions;
          startTask();
        },
        error => console.error(error)
      );
    } else {
      startTask();
    }
  }

  // взять задачу
  takeTask(PID, i) {
    this.http.get(`AnnoTasks/take?PID=${PID}&index=${i}`).subscribe(
      task => {
        if (task !== 'no free tasks') {
          // отдаём задачу аннотатору
          this.common.projects[0].annoTask = task;
          this.common.user.taskTaken = task.task.taken;
          this.startTask(this.common.projects[0].annoTask.task);
        } else {
          this.loadingTask = -1;
          this.common.alert('no free tasks');
        }
      },
      error => {
        this.loadingTask = -1;
        console.error(error);
      }
    );
  }

  startDemoTask() {
    // загружаем данные демо-таска
    const startTask = () => {
      this.http.get('/assets/demoHints.json').subscribe(
        demoHints => {
          this.annot.demoHints = demoHints;
          this.http.get('/assets/demoTask.json').subscribe(
            demoTask => {
              this.annot.task = demoTask;
              this.annot.task.FIDsList = Object.keys(this.annot.task.FIDs);
              this.annot.demoMode = true;
              this.annot.FID = 0;

              // запускаем режим аннотирования и включаем видео
              this.startAnnotating.emit();
              this.annot.setVideo();
            },
            error => console.error(error)
          );
        },
        error => console.error(error)
      );
    };

    // вынимаем все эмоции
    if (this.annot.emotions.length === 0) {
      this.http.get('EmotionsInfo/getAll').subscribe(
        emotions => {
          this.annot.emotions = emotions;
          startTask();
        },
        error => console.error(error)
      );
    } else {
      startTask();
    }
  }

  giveUp(i) {
    if (!this.isGivingUp && this.loadingTask === -1) {
      this.isGivingUp = true;
      const conf = this.common.confirm('Do you confirm your refusal to continue that task? If yes, you’ll get only 50% of task fee for the completed part.').subscribe(
        confirmed => {
          if (confirmed) {
            this.loadingTask = i;

            this.http.get('AnnoTasks/giveUp?taskTaken=' + this.common.user.taskTaken).subscribe(
              moneyEarned => {
                this.isGivingUp = false;
                this.loadingTask = -1;

                // забываем про взятую задачу
                for (const p in this.common.projects) {
                  delete this.common.projects[p].annoTask;
                }

                // обновляем баланс пользователя
                this.common.user.money.reserved = 0;
                this.common.user.money.available += moneyEarned;

                this.common.user.taskTaken = null;
              },
              error => {
                this.isGivingUp = false;
                this.loadingTask = -1;
                console.error(error);
              }
            );
          } else {
            this.isGivingUp = false;
          }
        },
        error => console.error(error)
      );

      this.common.commonConfirm.on('hidden.bs.modal', () => {
        this.common.commonConfirm.off('hidden.bs.modal');
        this.isGivingUp = false;
        conf.unsubscribe();
      });
    }
  }

  loadTerms() {
    if (this.common.terms.length === 0) {
      this.http.getRough('/content/getTerms').subscribe(
        terms => {
          this.common.terms = terms.text();
        },
        error => console.error(error)
      );
    }
  }
}
