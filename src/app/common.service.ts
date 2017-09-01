import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommonService {
  mode: string;
  profileMode = 'taskList';

  user: any = {
    nickname: '',
    rating: 0,
    money: {
      available: 0,
      reserved: 0,
    },
    tutorials: []
  };

  emotionGroups = [
    [48,35,36],
    [37,38,39],
    [40,41,42,43],
    [44,45,46,47],
    [31,32,33,34],
    [27,28,29,30]
  ]

  terms = '';

  progressBar = [];

  projects = []; // список проектов

  tutorialDone = false;
  tutorial;
  tutorialModal;
  isInTutorial = false;

  commonAlert;
  commonConfirm;

  alert(message, cb?) {
    this.commonAlert.find('.message').html(message);
    this.commonAlert.modal('show');
    this.commonAlert.on('hidden.bs.modal', () => {
      this.commonAlert.off('hidden.bs.modal');
      if (cb) {
        cb();
      }
    });
  }

  confirm(question, cb?) {
    this.commonConfirm.find('.question').html(question);
    this.commonConfirm.modal('show');
    this.commonConfirm.on('hidden.bs.modal', () => {
      this.commonConfirm.off('hidden.bs.modal');
      if (cb) {
        cb();
      }
    });

    return this.confirmed;
  }

  confirmed = new EventEmitter();
  confirmModal(answer) {
    this.confirmed.emit(answer);
  }

  testStarted = new EventEmitter();
  startTest(testIndex) {
    this.testStarted.emit(testIndex);
  }

  tutorialsUpdated = new EventEmitter();
  updateTutorials() {
    this.tutorialsUpdated.emit();
  }

  tutorialUpdated = new EventEmitter();
  updateTutorial() {
    this.tutorialUpdated.emit();
  }
}
