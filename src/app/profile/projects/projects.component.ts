import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectId = 0;

  projects = {
    marking: [
      {
        id: 1,
        title: 'Video "sharapova"',
        isActive: true,
        percentage: 90,
        earned: function() {
          return +(this.price * this.percentage / 100).toFixed(0);
        },
        price: 5000
      }
    ],
    annotating: [
      {
        id: 99,
        title: 'Video "bilan_0005"',
        isActive: false,
        percentage: 0,
        earned: function() {
          return +(this.price * this.percentage / 100).toFixed(0);
        },
        price: 1000
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
