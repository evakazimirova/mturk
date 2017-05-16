import { CommonService } from '../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileMode = 'taskList';
  projectId = 0;

  user = {
    nickname: "iGor",
    rating: 4,
    money: {
      available: 1000,
      reserved: 2000,
    }
  }

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

  constructor(public common: CommonService) { }

  ngOnInit() {
  }

}
