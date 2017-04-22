import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class CommonService {
  // общие свойства для всех компонент
  conf: any = {};
  csv = [[1, 0, 0, -1]];
  cf = 0;
  emotion = 0;
  videoContainer;

  // события
  videoTurnedOff = new EventEmitter();
  videoTurnedOn = new EventEmitter();
  videoChanged = new EventEmitter();
  fragmentChanged = new EventEmitter();
  fragmentRated = new EventEmitter();

  setFragment(number) {
    // не выходим за пределы таблицы
    if(number >= 0 && number < this.csv.length) {
      this.cf = number;
      this.fragmentChanged.emit(this.csv[number][1]);
    }
  }

  updateCSV(newCSV) {
    this.csv = newCSV;
    this.fragmentChanged.emit(this.csv[0][1]);
  }

  rateFragment(value) {
    this.fragmentRated.emit(value);
  }

  setVideo(value) {
    this.cf = 0;
    this.videoChanged.emit(value);
  }

  watchVideo() {
    if(this.videoContainer.paused) {
      this.videoContainer.play();
      this.videoTurnedOn.emit();
    }
  }

  unwatchVideo(event) {
    if(!this.videoContainer.paused) {
      this.videoContainer.pause();
      this.videoTurnedOff.emit(event); // передаём "пауза" или "стоп"
    }
  }
}
