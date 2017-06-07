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
  fragmentStart = 0;
  fragmentEnd = 0;

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
          // возвращаемся в начало фрагмента
          if (this.common.cf === -1) {
            this.common.videoContainer.currentTime = 0;
          } else {
            this.common.videoContainer.currentTime = this.common.csv[this.common.cf][0];
          }

          this.percentage = 0;
        }
      },
      (error) => console.log(error)
    );
  }

  startWatching() {
    if (this.watchingVideo !== undefined) {
      if (this.watchingVideo._zoneDelegates !== null) {
        clearInterval(this.watchingVideo);
      }
    }

    if (this.common.cf === -1) {
      this.fragmentStart = 0;
      this.fragmentEnd = this.common.videoLength;
    } else {
      this.fragmentStart = this.common.csv[this.common.cf][0];
      this.fragmentEnd = this.common.csv[this.common.cf][1];
    }
    const fragmentDuration = this.fragmentEnd - this.fragmentStart;

    const updateProgressBar = () => {
      const currentTime = this.common.videoContainer.currentTime;

      // проиграв фрагмент, останавливаем видео
      if (this.common.videoContainer.currentTime >= this.fragmentEnd) {
        this.common.unwatchVideo('stop');
      }

      const timeSpent = currentTime - this.fragmentStart;
      this.percentage = (timeSpent / fragmentDuration * 100).toFixed(0);
    };

    this.watchingVideo = setInterval(updateProgressBar, 50);
  }

  stopWatching() {
    clearInterval(this.watchingVideo);
  }
}
