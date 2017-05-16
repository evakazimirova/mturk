import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-profile-rating',
  templateUrl: './profile-rating.component.html',
  styleUrls: ['./profile-rating.component.scss']
})
export class ProfileRatingComponent implements OnInit {
  users = [
    {
      firstName: 'Игорь',
      secondName: 'Поляков',
      projects: 2,
      rating: 4
    },
    {
      firstName: 'Максим',
      secondName: 'Рябов',
      projects: 5,
      rating: 9
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
