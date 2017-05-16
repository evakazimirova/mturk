import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'na-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  @Output() profileModeSelected = new EventEmitter();
  selectProfileMode(page) {
    this.profileModeSelected.emit(page);
  }

  constructor() { }

  ngOnInit() {
  }

}
