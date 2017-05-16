import { CommonService } from '../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  editingProfile = false;

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
        title: 'Video "bilan_0005"',
        isActive: true,
        percentage: 66,
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
