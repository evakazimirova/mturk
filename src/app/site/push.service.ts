import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class PushService {
  markForThisChunk = new EventEmitter();
  saveThisMark(value) {
    this.markForThisChunk.emit(value);
  }

  currentVideo = new EventEmitter();
  setVideo(value) {
    this.currentVideo.emit(value);
  }
}
