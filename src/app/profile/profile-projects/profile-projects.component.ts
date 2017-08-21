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

  constructor(public common: CommonService,
              private http: HttpService,
              public annot: AnnotatingService) { }

  ngOnInit() {
    // this.areTutorialsFinished = true;
    // for (let tutorial of this.common.user.tutorials) {
    //   if (!this.areTutorialsFinished) {
    //     break;
    //   } else {
    //     for (let t in tutorial) {
    //       if (this.common.user.tutorials[this.common.tutorial][t] === 0) {
    //         this.areTutorialsFinished = false;
    //         break;
    //       }
    //     }
    //   }
    // }

    this.common.progressBar = [
      {
        action: 'Registraition and Confirm e-mail',
        done: true,
        go: () => {
          // console.log('confirm');
        }
      },
      {
        action: 'Demo Task and Get your 1$',
        done: this.common.user.demo === 1,
        go: () => {
          this.startDemoTask();
        }
      },
      {
        action: 'Fill the Profile',
        done: this.common.user.profile === 1 && this.common.user.englishTest !== 'NO',
        go: () => {
          this.common.profileMode = 'profile';
        }
      },
      {
        action: 'Short English Test',
        done: this.common.user.englishTest !== 'NO',
        go: () => {
          $('.english-test-modal').modal('show');
        }
      },
      {
        action: 'Learn Skills and Pass the Test in Tutorial',
        done: this.checkTutorials(),
        go: () => {
          // console.log('tutorials');
        }
      },
      {
        action: 'Finish Tasks and Get Money!',
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
            err => {
              this.isLoaded = true;
              console.error(err);
            }
          );
        },
        err => {
          this.isLoaded = true;
          console.error(err);
        }
      );
    }
  }

  // решаем, что делать с выбранной задачей
  taskSelected(project, i) {
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
        err => {
          this.loadingTask = -1;
          console.error(err);
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
      err => {
        this.loadingTask = -1;
        console.error(err);
      }
    );
  }

  startDemoTask() {
    const startTask = () => {
      this.annot.demoMode = true;
      // загружаем данные демо-таска
      this.annot.FID = 0;
      this.annot.task = {
        'ATID': 0,
        'done': 0,
        'FIDs': [
          {
            'FID': 1,
            'boxType': 'AND',
            'emotions': [ 37, 38, 39 ],
            'video': 'https://www.youtube.com/watch?v=wglgvziarPc',
            'result': {
              'FID': 1,
              'csv': 'start,end\r\n47,50\r\n50,56\r\n74,77'
            },
            'answers': [
              [37],
              [37],
              []
            ],
            'done': false
          },
          {
            'FID': 2,
            'boxType': 'AND',
            'emotions': [ 37, 38, 39 ],
            'video': 'https://www.youtube.com/watch?v=JjhvaDqB2wc',
            'result': {
              'FID': 2,
              'csv': 'start,end\r\n43,45\r\n62,66'
            },
            'answers': [
              [],
              []
            ],
            'done': false
          },
          {
            'FID': 3,
            'boxType': 'AND',
            'emotions': [ 37, 38, 39 ],
            'video': 'https://www.youtube.com/watch?v=NyHCIhFsZoA',
            'result': {
              'FID': 3,
              'csv': 'start,end\r\n389,390\r\n390,393\r\n393,395\r\n413,416'
            },
            'answers': [
              [38],
              [38, 39],
              [39],
              [39]
            ],
            'done': false
          }
        ]
      };
      this.annot.task.FIDsList = Object.keys(this.annot.task.FIDs);

      // запускаем режим аннотирования и включаем видео
      this.startAnnotating.emit();
      this.annot.setVideo();
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
}
