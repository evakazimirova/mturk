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
    for (const v in this.annot.task.FIDs) {
      // this.annot.task.FIDs[v].i = v;
      this.videos.push(this.annot.task.FIDs[v]);
    }

    for (const f in this.videos) {
      if (this.annot.task.FIDs[f].done) {
        this.annot.fragmentsWip[f] = this.annot.task.FIDs[f].result;
      } else {
        this.annot.fragmentsWip[f] = null;
      }
    }
  }

  // смена видео
  videoChanged(FID) {
    if (this.annot.FID !== FID) {
      // функция смены видео
      const setVideo = () => {
        this.annot.FID = FID;
        this.annot.setVideo();
      };

      // // есть ли ссылка на видос
      // if (this.videos[vi].video) {
        setVideo();
      // } else {
      //   // вынимаем информацию по видео из БД
      //   const FID = this.videos[vi].FID;
      //   this.http.get(`Fragments/getFragment?FID=${FID}`).subscribe(
      //     fragment => {
      //       // кэшируем данные по видео
      //       this.annot.task.fragments[vi] = fragment;
      //       setVideo();
      //     },
      //     err => {
      //       console.error(err);
      //     }
      //   );
      // }
    }
  }
}
