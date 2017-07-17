import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'na-profile-projects',
  templateUrl: './profile-projects.component.html',
  styleUrls: ['./profile-projects.component.scss']
})
export class ProfileProjectsComponent implements OnInit {
  // режим описания проекта
  projectMode = false;
  projectId = 0;

  // для индикаторов загрузки
  isLoaded = true;
  loadingTask = -1;

  constructor(public common: CommonService,
              private http: HttpService) { }

  ngOnInit() {
    // загружаем данные только один раз при входе
    if (!this.common.projects) {
      this.isLoaded = false;
      this.http.get('Projects/getAll').subscribe(
        projects => {
          // обновляем список проектов
          this.common.projects = projects;

          this.http.get('AnnoTasks/annoTasks').subscribe(
            tasks => {
              this.isLoaded = true;

              // обновляем проекты, которые делал пользователь
              for (const p in this.common.projects) {
                this.common.projects[p].annoTask = tasks[p];
              }

              // Считаем зарезервиродванную сумму
              this.common.user.money.reserved = 0;
              for (const task of tasks) {
                this.common.user.money.reserved = +task.price;
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

  // переход в режим описания проекта
  viewProjectDescription(id) {
    this.projectMode = true;
    this.projectId = id;
  }

  // решаем, что делать с выбранной задачей
  taskSelected(project, i) {
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

  // начать выполнение задачи
  startTask(ids) {
    this.http.post(ids, 'AnnoTasks/start').subscribe(
      task => {
        this.loadingTask = -1;

        // обновляем данные задачи
        task.emotions = task.tasks;
        delete task.tasks;
        this.common.task = task;

        // запускаем режим аннотирования и включаем видео
        this.common.mode = 'fragmentsRating';
        this.common.setVideo();
      },
      err => {
        this.loadingTask = -1;
        console.error(err);
      }
    );
  }

  // взять задачу
  takeTask(PID, i) {
    this.http.get(`AnnoTasks/take?PID=${PID}`).subscribe(
      task => {
        this.loadingTask = -1;

        if (task !== 'no free tasks') {
          // отдаём задачу аннотатору
          this.common.projects[i].annoTask = task;
        }
      },
      err => {
        this.loadingTask = -1;
        console.error(err);
      }
    );
  }
}
