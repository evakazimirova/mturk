import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class CommonService {
  mode: string; // auth | profile | fragmentsRating | fragmentsMarking

  user: any = {
    nickname: '',
    rating: 0,
    money: {
      available: 0,
      reserved: 0,
    }
  };

  projects = []; // список проектов
}
