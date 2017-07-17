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
    // обновляем список видео
    this.videos = this.common.task.fragments;
    for (const f of this.videos) {
      this.common.fragmentsWip[f.FID] = f.result;
    }
  }

  // смена видео
  videoChanged(vi) {
    if (this.common.task.currentFragment !== vi) {
      // функция смены видео
      const setVideo = () => {
        this.common.task.currentFragment = vi;
        this.common.setVideo();
      };

      // есть ли ссылка на видос
      if (this.videos[vi].video) {
        setVideo();
      } else {
        // вынимаем информацию по видео из БД
        const FID = this.videos[vi].FID;
        this.http.get(`Fragments/getFragment?FID=${FID}`).subscribe(
          fragment => {
            // кэшируем данные по видео
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
