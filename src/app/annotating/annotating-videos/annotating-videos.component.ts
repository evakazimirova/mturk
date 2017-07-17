import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../common.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-annotating-videos',
  templateUrl: './annotating-videos.component.html',
  styleUrls: ['./annotating-videos.component.scss']
})
export class AnnotatingVideosComponent implements OnInit {
  videos = [];

  constructor(public common: CommonService,
              private http: HttpService) { }

  ngOnInit() {
    this.videos = this.common.task.fragments;

    for (const f of this.common.task.fragments) {
      this.common.fragmentsWip[f.FID] = f.result;
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
