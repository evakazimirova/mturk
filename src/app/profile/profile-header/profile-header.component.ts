import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
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

  user;

  constructor(public common: CommonService, private http: HttpService) {}

  ngOnInit() {}

  signOut() {
    const confirmed = confirm("Do you really want to sign out?");

    if (confirmed) {
      this.http.getRough('/annotators/logout').subscribe(
        (res) => {
          this.common.mode = 'auth';
        },
        err => console.log(err)
      );
    }
  }
}
