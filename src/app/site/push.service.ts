import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class PushService {
  // общие свойства для всех компонент
  conf: any = {};
  csv = [[1, 0, 0, -1]];
  cf = 0;
  emotion = 0;

  // события
  currentFragment = new EventEmitter();
  currentVideoPosition = new EventEmitter();
  markForThisChunk = new EventEmitter();
  currentVideo = new EventEmitter();

  setFragment(number) {
    // не выходим за пределы таблицы
    if(number >= 0 && number < this.csv.length) {
      this.currentFragment.emit(number);
      this.currentVideoPosition.emit(this.csv[number][1]);
    }
  }

  updateCSV(newCSV) {
    this.csv = newCSV;
    this.currentVideoPosition.emit(this.csv[0][1]);
  }

  saveThisMark(value) {
    this.markForThisChunk.emit(value);
  }

  setVideo(value) {
    this.currentVideo.emit(value);
    this.cf = 0;
  }
}
