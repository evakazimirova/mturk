import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { AnnotatingService } from '../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-videos',
  templateUrl: './annotating-videos.component.html',
  styleUrls: ['./annotating-videos.component.scss']
})
export class AnnotatingVideosComponent implements OnInit {
  videos = [];

  constructor(public common: CommonService,
              private http: HttpService,
              public annot: AnnotatingService) { }

  ngOnInit() {
    // обновляем список видео
    this.videos = this.annot.task.fragments;
    for (const f of this.videos) {
      this.annot.fragmentsWip[f.FID] = f.result;
    }
  }

  // смена видео
  videoChanged(vi) {
    if (this.annot.task.currentFragment !== vi) {
      // функция смены видео
      const setVideo = () => {
        this.annot.task.currentFragment = vi;
        this.annot.setVideo();
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
            this.annot.task.fragments[vi] = fragment;
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
