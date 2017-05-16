import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})
export class AdminProjectsComponent implements OnInit {
  projectId = 0;
  projects = [
    {
      id: 0,
      title: "video_1",
      status: "Active",
      price: 3000
    },
    {
      id: 1,
      title: "video_2",
      status: "Inactive",
      price: 2000
    },
    {
      id: 2,
      title: "video_3",
      status: "Contest stage",
      price: 1000
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
