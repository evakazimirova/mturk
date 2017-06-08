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

  projects: any = [{}, {}];

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
    this.http.get('AnnoTasks/annoTasks').subscribe(
      tasks => {
        this.updateProjectInfo(this.projects[0], tasks[0]);
        this.updateProjectInfo(this.projects[1], tasks[1]);
        this.isLoaded = true;

        this.common.user.money.reserved = this.projects[0].price + this.projects[1].price;
      },
      err => console.log(err)
    );
  }

  takeMarkUp() {
    this.projects[0].isProcessing = true;

    this.http.get('AnnoTasks/take?PID=1').subscribe(
      task => {
        if (task !== 'no free tasks') {
          this.updateProjectInfo(this.projects[0], task);
        }
        this.projects[0].isProcessing = false;
      },
      err => console.log(err)
    );
  }

  takeEventSelection() {
    this.projects[1].isProcessing = true;

    this.http.get('AnnoTasks/take?PID=2').subscribe(
      task => {
        this.updateProjectInfo(this.projects[1], task);
        this.projects[1].isProcessing = false;
      },
      err => console.log(err)
    );
  }

  startMarkUp(ids) {
    this.projects[0].isProcessing = true;

    this.http.post(ids, 'AnnoTasks/start').subscribe(
      task => {
        this.common.task = task;
        this.common.setVideo();
        this.common.mode = 'fragmentsRating';
        this.projects[0].isProcessing = false;
      },
      err => console.log(err)
    );
  }

  startEventSelection(task) {
    this.common.mode = 'fragmentsMarking';
    this.common.task = task;
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
