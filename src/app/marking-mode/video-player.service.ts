import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class VideoPlayerService {
  videoContainer;

  // 15. Созданные фрагменты отображаются в таблице «список фрагментов»
  fragments = [];

  task: number = 0;

  cf = -1;

  videoLength = 0;
  timelineWidth = 0;

  tickPosition = 0;
  videoPosition = 0;

  startFragment = 0;
  endFragment = 0;

  fragmentSelected = new EventEmitter;

  setTickPosition(pos) {
    this.tickPosition = pos;

    if (this.videoContainer === undefined) {
      this.videoContainer = document.getElementById('videoToMark');
      this.videoLength = +(this.videoContainer.duration).toFixed(2);
    }

    let accurateVP = (pos / this.timelineWidth) * this.videoLength;
    accurateVP = +(+(accurateVP / 0.04).toFixed(0) * 0.04).toFixed(2); // подгоняем под целое число кадров

    this.videoPosition = accurateVP;
    this.videoContainer.currentTime = this.videoPosition;
  }

  setVideoPosition(pos) {
    pos = +(+(pos / 0.04).toFixed(0) * 0.04).toFixed(2);
    this.videoPosition = pos; // подгоняем под целое число кадров

    if (this.videoContainer === undefined) {
      this.videoContainer = document.getElementById('videoToMark');
      this.videoLength = +(this.videoContainer.duration).toFixed(2);
    }

    this.tickPosition = +((pos / this.videoLength) * this.timelineWidth).toFixed(2);
    this.videoContainer.currentTime = pos;
  }

  selectFragment() {
    this.fragmentSelected.emit();
  }
}
