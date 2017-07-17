import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-profile-projects',
  templateUrl: './profile-projects.component.html',
  styleUrls: ['./profile-projects.component.scss']
})
export class ProfileProjectsComponent implements OnInit {
  projectMode = false;
  projectId = 0;
  isLoaded = false;
  loadingTask = -1;

  projects;

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
    this.http.get('Projects/getAll').subscribe(
      projects => {
        // console.log(projects);
        this.projects = projects;

        this.http.get('AnnoTasks/annoTasks').subscribe(
          tasks => {
            for (const p in this.projects) {
              this.projects[p].annoTask = tasks[p];
            }

            // Считаем зарезервиродванную сумму
            this.common.user.money.reserved = 0;
            for (const task of tasks) {
              this.common.user.money.reserved = +task.price;
            }

            this.isLoaded = true;
          },
          err => {
            console.log(err);
            this.isLoaded = true;
          }
        );
      },
      err => {
        console.log(err);
        this.isLoaded = true;
      }
    );
  }

  // takeEventSelection() {
  //   if (this.loadingTask === -1) {
  //     this.projects[1].isProcessing = true;
  //     this.loadingTask = 1;

  //     this.http.get('AnnoTasks/take?PID=2').subscribe(
  //       task => {
  //         if (task !== 'no free tasks') {
  //           this.updateProjectInfo(this.projects[1], task);
  //         }
  //         this.projects[1].isProcessing = false;
  //         this.loadingTask = -1;
  //       },
  //       err => {
  //         console.log(err);
  //         this.loadingTask = -1;
  //       }
  //     );
  //   }
  // }

  // startEventSelection(ids) {
  //   if (this.loadingTask === -1) {
  //     this.projects[1].isProcessing = true;
  //     this.loadingTask = 1;

  //     this.http.post(ids, 'AnnoTasks/start').subscribe(
  //       task => {
  //         this.common.task = task;
  //         this.common.setVideo();
  //         this.common.mode = 'fragmentsMarking';
  //         this.projects[1].isProcessing = false;

  //         this.loadingTask = -1;
  //       },
  //       err => {
  //         console.log(err);
  //         this.loadingTask = -1;
  //       }
  //     );
  //   }
  // }

  viewProjectDescription(id) {
    this.projectMode = true;
    this.projectId = id;
  }

  // updateTasksAction(project) {
  //   project.action = {};
  //   switch (project.activity) {
  //     case "Inactive":
  //       project.action.title = "Start new task";
  //       if (project.id === 1) {
  //         project.action.doIt = (event) => {
  //           event.preventDefault();
  //           this.takeMarkUp();
  //         }
  //       } else if (project.id === 2) {
  //         project.action.doIt = (event) => {
  //           event.preventDefault();
  //           this.takeEventSelection();
  //         }
  //       }
  //       break;

  //     case "Active":
  //       project.action.title = "Continue";
  //       if (project.id === 1) {
  //         project.action.doIt = (event) => {
  //           event.preventDefault();
  //           this.startMarkUp(project.task);
  //         };
  //       } else if (project.id === 2) {
  //         project.action.doIt = (event) => {
  //           event.preventDefault();
  //           this.startEventSelection(project.task);
  //         };
  //       }
  //       break;
  //   }
  // }

  updateProjectInfo(project, task) {
    project.activity = task.activity;
    project.percentage = task.percentage;
    project.earned = task.earned;
    project.price = task.price;
    project.task = task.task;

    project.id = task.task.PID;

    if (project.id === 1) {
      project.title = 'Mark up a video';
    }

    if (project.id === 2) {
      project.title = 'Event selection';
    }

    // this.updateTasksAction(project);
  }

  taskSelected(project) {
    if (project.annoTask) {
      // console.log('Задача взята');
      // Продолжить выполнение
      this.startTask(project.annoTask.task);
    } else {
      // console.log('Задача не взята');
      // Дать задачу или запретить
      this.takeTask(project.PID);
    }
  }

  startTask(ids) {
    if (this.loadingTask === -1) {
      this.projects[0].isProcessing = true;
      this.loadingTask = 0;

      this.http.post(ids, 'AnnoTasks/start').subscribe(
        task => {
          task.emotions = task.tasks;
          delete task.tasks;

          this.common.task = task;
          this.common.setVideo();
          this.common.mode = 'fragmentsRating';
          this.projects[0].isProcessing = false;

          this.loadingTask = -1;
        },
        err => {
          console.log(err);
          this.loadingTask = -1;
        }
      );
    }
  }

  takeTask(PID) {
    if (this.loadingTask === -1) {
      const PI = PID - 1;
      this.projects[PI].isProcessing = true;
      this.loadingTask = PI;

      this.http.get('AnnoTasks/take?PID=1').subscribe(
        task => {
          if (task !== 'no free tasks') {
            this.updateProjectInfo(this.projects[PI], task);
          }
          this.projects[PI].isProcessing = false;
          this.loadingTask = -1;
        },
        err => {
          console.log(err);
          this.loadingTask = -1;
        }
      );
    }
  }
}
