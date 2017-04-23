import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  percentage: string | number = 0;
  watchingVideo;

  constructor(private common: CommonService) { }

  ngOnInit() {
    this.common.videoTurnedOn.subscribe(
      () => this.startWatching(),
      (error) => console.log(error)
    );

    this.common.videoTurnedOff.subscribe(
      (event) => {
        this.stopWatching();
        if (event === "stop") {
          this.common.videoContainer.currentTime = this.common.csv[this.common.cf][1]; // возвращаемся в начало фрагмента
          this.percentage = 0;
        }
      },
      (error) => console.log(error)
    );
  }

  startWatching() {
    if(this.watchingVideo !== undefined) {
      if(this.watchingVideo._zoneDelegates !== null) {
        clearInterval(this.watchingVideo);
      }
    }

    let fragmentStart = this.common.csv[this.common.cf][1];
    let fragmentEnd = this.common.csv[this.common.cf][2];
    let fragmentDuration = fragmentEnd - fragmentStart;

    let updateProgressBar = () => {
      let currentTime = this.common.videoContainer.currentTime;

      // проиграв фрагмент, останавливаем видео
      if(this.common.videoContainer.currentTime >= fragmentEnd) {
        this.common.unwatchVideo("stop");
      }

      let timeSpent = currentTime - fragmentStart;
      this.percentage = (timeSpent / fragmentDuration * 100).toFixed(0);
    }

    this.watchingVideo = setInterval(updateProgressBar, 50);
  }

  stopWatching() {
    clearInterval(this.watchingVideo);
  }
}
