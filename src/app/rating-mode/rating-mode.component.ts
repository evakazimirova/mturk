import { CommonService } from './../common.service';
import { HttpService } from './../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-rating-mode',
  templateUrl: './rating-mode.component.html',
  styleUrls: ['./rating-mode.component.scss']
})
export class RatingModeComponent implements OnInit {
  videos = [];

  constructor(private http: HttpService, private common: CommonService) {}

  ngOnInit() {
    this.videos = this.common.task.fragments;

    for (const f of this.common.task.fragments) {
      this.common.fragmentsWip[f.FID] = f.result;
    }
  }

  return() {
    const confirmed = confirm('Are you sure you want to leave the task without saving progress?');

    if (confirmed) {
      this.common.mode = 'profile';
    }
  }

  videoChanged(vi) {
    if (this.common.task.currentFragment !== vi) {
      const setVideo = () => {
        this.common.task.currentFragment = vi;
        this.common.setVideo();
      };

      if (this.common.task.fragments[vi].video) {
        // Ссылка на видос есть
        setVideo();
      } else {
        // Ссылки нет — вынимаем из базы
        const FID = this.common.task.fragments[vi].FID;
        this.http.get(`Fragments/getFragment?FID=${FID}`).subscribe(
          fragment => {
            this.common.task.fragments[vi] = fragment;
            setVideo();
          },
          err => {
            console.error(err);
          }
        );
      }
    }

  }
}
