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

  constructor(public common: CommonService) { }

  ngOnInit() {
  }

}
