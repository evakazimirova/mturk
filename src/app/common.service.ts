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

  // список проектов
  projects;



  csv = [[1, 0, 0, -1]];
  rating = [[]];
  cf = -1;
  emotion = 0;
  videoContainer;
  videoLength = 0;
  allFragmentsRated = true;
  task: any;
  fragmentsWip = {};

  isYouTube: boolean;
  ytPlayer;

  // события
  videoTurnedOff = new EventEmitter();
  videoTurnedOn = new EventEmitter();
  videoChanged = new EventEmitter();
  fragmentChanged = new EventEmitter();
  fragmentRated = new EventEmitter();

  setFragment(number) {
    // останавливаем воспроизведение
    this.unwatchVideo('pause');
    // не выходим за пределы таблицы
    if (number >= -1 && number < this.csv.length) {
      this.cf = number;
      if (number === -1) {
        this.fragmentChanged.emit(0);
      } else {
        this.fragmentChanged.emit(this.csv[number][0]);
      }
    }
  }

  updateCSV(newCSV) {
    this.csv = newCSV;
    this.rating = [];

    let totalEmotions = this.task.emotions.length;
    let totalFragments = newCSV.length;

    // перебираем все эмоции
    for (let i = 0; i < totalEmotions; i++) {
      this.rating.push([]);

      // заполняем неоценненые фрагменты
      for (let j = 0; j < totalFragments; j++) {
        this.rating[i].push(-1);
      }
    }

    // this.watchVideo();
  }

  rateFragment(value) {
    this.fragmentRated.emit(value);
  }

  setVideo() {
    // let itsOk = false;

    // // 13. При попытке сменить воспроизводимый видеофайл, пользователь должен получать предупреждение о необходимости сохранения размеченных данных, если он этого не сделал ранее. Аналогичное поведение должно наблюдаться при закрытии страницы.
    // if (!this.allFragmentsRated) {
    //   itsOk = confirm("Разметка этого видео не сохранена. Вы уверены, что хотите перейти к разметке другого видео без сохранения?");
    // }

    let itsOk = true;

    if (itsOk || this.allFragmentsRated) {
      if (this.ytPlayer || this.videoContainer) {
        this.unwatchVideo('stop');
      }
      this.cf = -1;
      this.allFragmentsRated = false;
      this.videoChanged.emit();
    }
  }

  watchVideo() {
    if (this.isYouTube) {
      this.ytPlayer.playVideo();
    } else {
      if (this.videoContainer.paused) {
        this.videoContainer.play();
      }
    }
    this.videoTurnedOn.emit(); // передаём "пауза" или "стоп"
  }

  unwatchVideo(event) {
    if (this.isYouTube) {
      this.ytPlayer.pauseVideo();
    } else {
      if (!this.videoContainer.paused) {
        this.videoContainer.pause();
      }
    }
    this.videoTurnedOff.emit(event); // передаём "пауза" или "стоп"
  }
}
