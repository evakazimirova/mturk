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

  projects = [
    {
      id: 1,
      isProcessing: false,
      title: 'Mark up a video',
      activity: "Inactive",
      video: 'sharapova',
      percentage: 0,
      earned: 0,
      price: 0,
      action: {
        title: '',
        doIt: (event) => console.log()
      },
      task: {
        ATID: 13,
        TID: 1,
        CID: 1,
        emotions: '1,3'
      }
    },
    {
      id: 2,
      isProcessing: false,
      title: 'Event selection',
      activity: "Active",
      video: 'sharapova',
      percentage: 0,
      earned: 0,
      price: 0,
      action: {
        title: '',
        doIt: (event) => console.log()
      },
      task: {
        ATID: 1,
        TID: 1,
        CID: 1,
        events: '1,2,3'
      }
    }
  ];

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
    this.http.get('AnnotatorTasksMarkUP/annoTask').subscribe(
      task => {
        this.updateProjectInfo(this.projects[0], task);
        this.isLoaded = true;

        this.common.user.money.reserved = this.projects[0].price + this.projects[1].price;
      },
      err => console.log(err)
    );

    this.http.get('AnnotatorTasksEventSelection/annoTask').subscribe(
      task => {
        this.updateProjectInfo(this.projects[1], task);
        this.isLoaded = true;

        this.common.user.money.reserved = this.projects[0].price + this.projects[1].price;
      },
      err => console.log(err)
    );
  }

  takeMarkUp() {
    this.projects[0].isProcessing = true;

    this.http.get('AnnotatorTasksMarkUP/take').subscribe(
      task => {
        this.updateProjectInfo(this.projects[0], task);
        this.projects[0].isProcessing = false;
      },
      err => console.log(err)
    );
  }

  takeEventSelection() {
    this.projects[1].isProcessing = true;

    this.http.get('AnnotatorTasksEventSelection/take').subscribe(
      task => {
        this.updateProjectInfo(this.projects[1], task);
        this.projects[1].isProcessing = false;
      },
      err => console.log(err)
    );
  }

  startMarkUp(ids) {
    this.projects[0].isProcessing = true;

    this.http.post(ids, 'AnnotatorTasksMarkUP/start').subscribe(
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
          }
        } else if (project.id === 2) {
          project.action.doIt = (event) => {
            event.preventDefault();
            this.startEventSelection(project.task);
          }
        }
        break;
    }
  }

  updateProjectInfo(project, task) {
    project.activity = task.activity;
    project.earned = task.earned;
    project.percentage = task.percentage;
    project.price = task.price;
    project.video = task.video;
    this.updateTasksAction(project);
  }
}
