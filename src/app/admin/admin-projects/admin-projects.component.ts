import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})
export class AdminProjectsComponent implements OnInit {
  projects = [
    {
      id: 1,
      title: "Видос_1",
      status: "Активный",
      price: 3000
    },
    {
      id: 2,
      title: "Видос_2",
      status: "Не активный",
      price: 2000
    },
    {
      id: 3,
      title: "Видос_3",
      status: "Активный",
      price: 1000
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
