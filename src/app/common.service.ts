import { EventEmitter, Injectable } from '@angular/core';

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
    }
  };

  projects = []; // список проектов

  commonAlert;

  alert(message) {
    this.commonAlert.find('.message').html(message);
    this.commonAlert.modal('show');
  }
}
