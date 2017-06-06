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

  projects = {
    marking: [
      {
        id: 1,
        title: 'sharapova',
        activity: "Active",
        percentage: 90,
        earned: function() {
          return +(this.price * this.percentage / 100).toFixed(0);
        },
        price: 5000
      }
    ],
    annotating: [
      {
        id: 17,
        title: 'bilan_0005',
        activity: "Inactive",
        percentage: 0,
        earned: function() {
          return +(this.price * this.percentage / 100).toFixed(0);
        },
        price: 3000
      },
      {
        id: 99,
        title: 'bilan_0001',
        activity: "Contest stage",
        percentage: 0,
        earned: function() {
          return +(this.price * this.percentage / 100).toFixed(0);
        },
        price: 1000
      }
    ]
  }

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
}
