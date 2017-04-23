import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class VideoPlayerService {
  videoContainer;

  // 15. Созданные фрагменты отображаются в таблице «список фрагментов»
  fragments = [];

  videoLength = 0;
  timelineWidth = 0;

  tickPosition = 0;
  videoPosition = 0;

  setTickPosition(pos) {
    this.tickPosition = pos;

    if (this.videoContainer === undefined) {
      this.videoContainer = document.getElementById('videoToMark');
      this.videoLength = +(this.videoContainer.duration).toFixed(1);
    }

    this.videoPosition = +((pos / this.timelineWidth) * this.videoLength).toFixed(1);
    this.videoContainer.currentTime = this.videoPosition;
  }

  setVideoPosition(pos) {
    this.videoPosition = pos;

    if (this.videoContainer === undefined) {
      this.videoContainer = document.getElementById('videoToMark');
      this.videoLength = +(this.videoContainer.duration).toFixed(1);
    }

    this.tickPosition = +((pos / this.videoLength) * this.timelineWidth).toFixed(1);
    this.videoContainer.currentTime = pos;
  }
}
