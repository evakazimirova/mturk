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
      error => console.error(error)
    );

    this.common.videoTurnedOff.subscribe(
      (event) => {
        this.stopWatching();
        if (event === "stop") {
          // возвращаемся в начало фрагмента
          let fragmentPosition;
          if (this.common.cf === -1) {
            fragmentPosition = 0;
          } else {
            fragmentPosition = this.common.csv[this.common.cf][0];
          }

          if (this.common.isYouTube) {
            this.common.ytPlayer.stopVideo();
          } else {
            this.common.videoContainer.currentTime = fragmentPosition;
          }

          this.percentage = 0;
        }
      },
      error => console.error(error)
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
      let currentTime;
      if (this.common.isYouTube) {
        this.common.ytPlayer.getCurrentTime().then((time) => {
          currentTime = time;
          countPercentage(this);
        });
      } else {
        currentTime = this.common.videoContainer.currentTime;
        countPercentage(this);
      }

      function countPercentage(that) {
        // проиграв фрагмент, останавливаем видео
        if (currentTime >= that.fragmentEnd) {
          that.common.unwatchVideo('pause');
        }

        const timeSpent = currentTime - that.fragmentStart;
        that.percentage = (timeSpent / fragmentDuration * 100).toFixed(0);
      }
    };

    this.watchingVideo = setInterval(updateProgressBar, 50);
  }

  stopWatching() {
    clearInterval(this.watchingVideo);
  }
}
