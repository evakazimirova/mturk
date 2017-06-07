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

  projects = [
    {
      id: 1,
      title: 'Mark up a video',
      activity: "Inactive",
      video: 'sharapova',
      percentage: 0,
      earned: 0,
      price: 3000,
      action: {
        title: '',
        doIt: (event) => console.log()
      }
    },
    {
      id: 2,
      title: 'Event selection',
      activity: "Active",
      video: 'sharapova',
      percentage: 90,
      earned: 0,
      price: 5000,
      action: {
        title: '',
        doIt: (event) => console.log()
      }
    }
  ]

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
    this.http.get('AnnotatorTasksEventSelection/annoTasks').subscribe(
      newTask => console.log(newTask),
      err => console.log(err)
    );

    this.http.get('AnnotatorTasksMarkUP/annoTasks').subscribe(
      newTask => console.log(newTask),
      err => console.log(err)
    );


    for (let project of this.projects) {
      project.earned = +(project.price * project.percentage / 100).toFixed(0)

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
              this.startMarkUp(project.video);
            }
          } else if (project.id === 2) {
            project.action.doIt = (event) => {
              event.preventDefault();
              this.startEventSelection(project.video);
            }
          }
          break;
      }
    }
  }

  takeEventSelection() {
    this.http.get('AnnotatorTasksEventSelection/take').subscribe(
      newTask => console.log(newTask),
      err => console.log(err)
    );
  }

  takeMarkUp() {
    this.http.get('AnnotatorTasksMarkUP/take').subscribe(
      newTask => console.log(newTask),
      err => console.log(err)
    );
  }

  startEventSelection(video) {
    this.common.mode = 'fragmentsRating';
    this.common.cv = video;
  }

  startMarkUp(video) {
    this.common.mode = 'fragmentsMarking';
    this.common.cv = video;
  }

  viewProjectDescription(id) {
    this.projectMode = true;
    this.projectId = id;
  }
}
