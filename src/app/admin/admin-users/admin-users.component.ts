import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users = [
    {
      firstName: 'Игорь',
      secondName: 'Поляков',
      email: 'igor_polyakov@phystech.edu',
      projects: 2,
      completed: 5,
      progress: [
        10,
        70
      ]
    },
    {
      firstName: 'Максим',
      secondName: 'Рябов',
      email: 'm.ryabov@neurodatalab.com',
      projects: 2,
      completed: 7,
      progress: [
        50,
        83
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
