import { _switch } from 'rxjs/operator/switch';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class PushService {
  csv = [[1, 0, 0, -1]];
  cf;
  currentFragment = new EventEmitter();
  currentVideoPosition = new EventEmitter();
  setFragment(value) {
    this.currentFragment.emit(value);
    this.currentVideoPosition.emit(this.csv[value][1]);
  }

  updateCSV(newCSV) {
    this.csv = newCSV;
    this.currentVideoPosition.emit(this.csv[0][1]);
  }

  markForThisChunk = new EventEmitter();
  saveThisMark(value) {
    this.markForThisChunk.emit(value);
  }

  currentVideo = new EventEmitter();
  setVideo(value) {
    this.currentVideo.emit(value);
  }
}
