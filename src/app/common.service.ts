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

  progressBar = [
    {
      action: 'Registraition and Confirm e-mail',
      done: true
    },
    {
      action: 'Demo Task and Get your 1$',
      done: this.user.demo === 1
    },
    {
      action: 'Fill the Profile',
      done: this.user.profile === 1
    },
    {
      action: 'Short English Test',
      done: this.user.englishTest !== 'NO'
    },
    {
      action: 'Learn Skills and Pass the Test in Totorial',
      done: false
    },
    {
      action: 'Finish Tasks and Get Money!',
      done: false
    }
  ];

  projects = []; // список проектов

  tutorialDone = false;
  tutorial;

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
}
