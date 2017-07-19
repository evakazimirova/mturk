import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class AnnotatingService {
  csv = [[1, 0, 0, -1]];
  rating = [[]];
  fragmentsWip = {};
  cf = -1;
  emotions = [];
  emotion = 0;
  videoContainer;
  videoLength = 0;
  allFragmentsRated = true;
  task: any;
  FID;

  isYouTube: boolean;
  ytPlayer;

  // события
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

    const totalEmotions = this.task.FIDs[this.FID].emotions.length;
    const totalFragments = newCSV.length;

    // перебираем все эмоции
    for (let i = 0; i < totalEmotions; i++) {
      this.rating.push([]);

      // заполняем неоценненые фрагменты
      for (let j = 0; j < totalFragments; j++) {
        this.rating[i].push(-1);
      }
    }
  }

  // оценивание фрагмента
  rateFragment(value) {
    this.fragmentRated.emit(value);
  }

  checkEmo(e) {
    this.rating[e][this.cf] = 1;
  }

  uncheckEmos(e1, e2?) {
    if (e2) {
      this.rating[e1][this.cf] = 0;
      this.rating[e2][this.cf] = 0;
    } else {
      if (e1 === 'all') {
        for (const e in this.task.FIDs[this.FID].emotions) {
          this.rating[e][this.cf] = 0;
        }
      } else {
        this.rating[e1][this.cf] = 0;
      }
    }
  }

  // смена видео
  setVideo() {
    let itsOk = false;

    // предупреждение о необходимости сохранения размеченных данных
    if (!this.allFragmentsRated) {
      itsOk = confirm('Разметка этого видео не сохранена. Вы уверены, что хотите перейти к разметке другого видео без сохранения?');
    }

    if (itsOk || this.allFragmentsRated) {
      // останавливаем текущее воспроизведение
      if (this.ytPlayer || this.videoContainer) {
        this.unwatchVideo('stop');
      }
      // запускаем новое видео целиком
      this.cf = -1;
      // фрагменты по умолчанию не размечены
      this.allFragmentsRated = false;
      // сообщаем всем компонентам, что видео сменилось
      this.videoChanged.emit();
    }
  }

  videoTurnedOn = new EventEmitter();
  watchVideo() {
    // выбираем нужное действие для соответствующего плеера
    if (this.isYouTube) {
      this.ytPlayer.playVideo();
    } else {
      if (this.videoContainer.paused) {
        this.videoContainer.play();
      }
    }

    // передаём событие другим компонентам
    this.videoTurnedOn.emit();
  }

  videoTurnedOff = new EventEmitter();
  unwatchVideo(event) {
    // ставим видео на паузу
    // выбираем нужное действие для соответствующего плеера
    if (this.isYouTube) {
      this.ytPlayer.pauseVideo();
    } else {
      if (!this.videoContainer.paused) {
        this.videoContainer.pause();
      }
    }

    // возвращаемся в начало при полной остановке
    if (event === 'stop') {
      let startTime;

      // целиком ли воспроизводится видео
      if (this.cf === -1) {
        // начало видео
        startTime = 0;
      } else {
        // начало фрагмента
        startTime = this.csv[this.cf][0];
      }

      // задаём позицию видео для данного плеера
      if (this.isYouTube) {
        this.ytPlayer.seekTo(startTime, true);
      } else {
        this.videoContainer.currentTime = startTime;
      }
    }

    // передаём событие другим компонентам
    this.videoTurnedOff.emit(event);
  }
}
