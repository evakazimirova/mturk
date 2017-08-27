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
    if (this.profileMode === 'annotating') {
      const subscription = this.common.confirm('Are you sure you want to leave the annotating task without saving progress?').subscribe(
        allowed => {
          subscription.unsubscribe();

          if (allowed) {
            // чтобы плеер не ругался при повторном запуске
            this.annot.allFragmentsRated = true;
            this.profileModeSelected.emit(page);

            // выход из демо-режима
            if (this.annot.demoMode) {
              this.annot.demoMode = false;
            }

            // прекращаем напоминать о прохождении туториала
            if (this.annot.reminder) {
              clearInterval(this.annot.reminder);
            }
          }
        }
      );
    } else {
      this.profileModeSelected.emit(page);
    }
  }

  signOut() {
    // подтверждение выхода из системы
    const subscription = this.common.confirm('Do you really want to sign out?').subscribe(
      answer => {
        subscription.unsubscribe();

        if (answer) {
          this.http.getRough('/annotators/logout').subscribe(
            res => {
              // выходим из системы
              this.common.mode = 'auth';
            },
            err => console.error(err)
          );
        }
      }
    );
  }
}
