import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'na-profile-profile',
  templateUrl: './profile-profile.component.html',
  styleUrls: ['./profile-profile.component.scss']
})
export class ProfileProfileComponent implements OnInit {
  @Output() profileModeSelected = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  selectProfileMode(page) {
    this.profileModeSelected.emit(page);
  }
}
