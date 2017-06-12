import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectMode = false;
  projectId = 0;
  isLoaded = false;
  loadingTask = -1;

  projects: any = [{}, {}];

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
    this.http.get('AnnoTasks/annoTasks').subscribe(
      tasks => {
        this.updateProjectInfo(this.projects[0], tasks[0]);
        this.updateProjectInfo(this.projects[1], tasks[1]);

        this.common.user.money.reserved = this.projects[0].price + this.projects[1].price;
        this.isLoaded = true;
      },
      err => {
        console.log(err);
        this.isLoaded = true;
      }
    );
  }

  takeMarkUp() {
    if (this.loadingTask === -1) {
      this.projects[0].isProcessing = true;
      this.loadingTask = 0;

      this.http.get('AnnoTasks/take?PID=1').subscribe(
        task => {
          if (task !== 'no free tasks') {
            this.updateProjectInfo(this.projects[0], task);
          }
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

  takeEventSelection() {
    if (this.loadingTask === -1) {
      this.projects[1].isProcessing = true;
      this.loadingTask = 1;

      this.http.get('AnnoTasks/take?PID=2').subscribe(
        task => {
          if (task !== 'no free tasks') {
            this.updateProjectInfo(this.projects[1], task);
          }
          this.projects[1].isProcessing = false;
          this.loadingTask = -1;
        },
        err => {
          console.log(err);
          this.loadingTask = -1;
        }
      );
    }
  }

  startMarkUp(ids) {
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

  startEventSelection(ids) {
    if (this.loadingTask === -1) {
      this.projects[1].isProcessing = true;
      this.loadingTask = 1;

      this.http.post(ids, 'AnnoTasks/start').subscribe(
        task => {
          this.common.task = task;
          this.common.setVideo();
          this.common.mode = 'fragmentsMarking';
          this.projects[1].isProcessing = false;

          this.loadingTask = -1;
        },
        err => {
          console.log(err);
          this.loadingTask = -1;
        }
      );
    }
  }

  viewProjectDescription(id) {
    this.projectMode = true;
    this.projectId = id;
  }

  updateTasksAction(project) {
    project.action = {};
    switch (project.activity) {
      case "Inactive":
        project.action.title = "Start new task";
        if (project.id === 1) {
          project.action.doIt = (event) => {
            event.preventDefault();
            this.takeMarkUp();
          }
        } else if (project.id === 2) {
          project.action.doIt = (event) => {
            event.preventDefault();
            this.takeEventSelection();
          }
        }
        break;

      case "Active":
        project.action.title = "Continue";
        if (project.id === 1) {
          project.action.doIt = (event) => {
            event.preventDefault();
            this.startMarkUp(project.task);
          };
        } else if (project.id === 2) {
          project.action.doIt = (event) => {
            event.preventDefault();
            this.startEventSelection(project.task);
          };
        }
        break;
    }
  }

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

    this.updateTasksAction(project);
  }
}
