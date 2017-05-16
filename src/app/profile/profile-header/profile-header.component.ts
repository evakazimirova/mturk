import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'na-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit {
  @Input() profileMode;
  @Output() profileModeSelected = new EventEmitter();
  selectProfileMode(page) {
    this.profileModeSelected.emit(page);
  }

  user = {
    nickname: "iGor",
    rating: 4,
    money: {
      available: 1000,
      reserved: 2000,
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
