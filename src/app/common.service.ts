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


  projects = []; // список проектов

  commonAlert;
  commonConfirm;

  alert(message) {
    this.commonAlert.find('.message').html(message);
    this.commonAlert.modal('show');
  }

  confirm(question) {
    this.commonConfirm.find('.question').html(question);
    this.commonConfirm.modal('show');

    return this.confirmed;
  }

  confirmed = new EventEmitter();
  confirmModal(answer) {
    this.confirmed.emit(answer);
  }
}
