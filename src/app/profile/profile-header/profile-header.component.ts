import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { AnnotatingService } from '../annotating/annotating.service';

@Component({
  selector: 'na-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent {
  @Input() profileMode;
  @Output() profileModeSelected = new EventEmitter();

  constructor(public common: CommonService,
              private annot: AnnotatingService,
              private http: HttpService) {}

  selectProfileMode(page) {
    let allowed = true;

    if (this.profileMode === 'annotating') {
      allowed = confirm('Are you sure you want to leave the annotating task without saving progress?');

      if (allowed) {
        // чтобы плеер не ругался при повторном запуске
        this.annot.allFragmentsRated = true;
      }
    }

    if (allowed) {
      this.profileModeSelected.emit(page);
    }
  }

  signOut() {
    // подтверждение выхода из системы
    const confirmed = confirm('Do you really want to sign out?');
    if (confirmed) {
      this.http.getRough('/annotators/logout').subscribe(
        res => {
          // выходим из системы
          this.common.mode = 'auth';
        },
        err => console.error(err)
      );
    }
  }
}
