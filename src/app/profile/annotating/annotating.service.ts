import { EventEmitter, Injectable } from '@angular/core';
import { CommonService } from '../../common.service';

@Injectable()
export class AnnotatingService {
  csv = [[1, 0, 0, -1]];
  rating = [[]];
  rated = [];
  fragmentsWip = [];
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
  percentageUpdated = new EventEmitter();

  constructor(private common: CommonService) {}

  updatePercentage(tasksDone) {
    const newPart = +(tasksDone / this.task.FIDs.length).toFixed(2);
    const newPercentage = newPart * 100;
    this.common.projects[this.common.user.taskTaken - 1].annoTask.percentage = newPercentage;
    this.common.projects[this.common.user.taskTaken - 1].annoTask.earned = +(newPart * this.common.projects[this.common.user.taskTaken - 1].annoTask.price).toFixed(0);

    this.percentageUpdated.emit(newPercentage);
  }

  setFragment(number, loadingVideo = false) {
    const setFragment = (number) => {
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

    if (loadingVideo) {
      if (this.isYouTube) {
        this.ytPlayer.removeEventListener('onStateChange', () => {
          setFragment(number);
        });
      }
    } else {
      // останавливаем воспроизведение
      this.unwatchVideo('pause');

      setFragment(number);
    }
  }

  updateCSV(newCSV) {
    if (this.task.FIDs[this.FID].done) {
      // выкидываем первую строку с заголовками
      newCSV.shift();
    }

    this.rating = [];
    this.rated = [];

    const totalEmotions = this.task.FIDs[this.FID].emotions.length;
    const totalFragments = newCSV.length;

    // проставляем рейтинг
    for (let j = 0; j < totalFragments; j++) {
      this.rated.push(this.task.FIDs[this.FID].result.csv[0] === 'S');
    }

    // перебираем все эмоции
    for (let i = 0; i < totalEmotions; i++) {
      this.rating.push([]);

      // заполняем неоценненые фрагменты
      for (let j = 0; j < totalFragments; j++) {
        this.rating[i].push(-1);
      }
    }

    if (this.task.FIDs[this.FID].done) {
      for (const row in newCSV) {
        for (let i = 0; i < totalEmotions; i++) {
          this.rating[i][row] = +newCSV[row][i + 2];
          // delete newCSV[row][i + 2];
        }
        newCSV[row] = newCSV[row].splice(0, 2);
      }
    }

    this.csv = newCSV;
  }

  rateFragment(value) {
    // оценивание фрагмента
    this.rating[this.emotion][this.cf] = value;

    // перескакиваем на следуюущий фрагмент
    if (this.cf < this.csv.length - 1) {
      this.setFragment(this.cf + 1);
    }

    this.fragmentRated.emit(value);
  }

  checkEmo(e) {
    if (this.task.FIDs[this.FID].boxType === 'OR') {
      // взаимоисключающие варианты
      this.rating[e][this.cf] = 1;
      if (e === 0) {
        this.rating[1][this.cf] = 0;
      } else if (e === 1) {
        this.rating[0][this.cf] = 0;
      } else if (e === 2) {
        this.rating[3][this.cf] = 0;
      } else if (e === 3) {
        this.rating[2][this.cf] = 0;
      }
    } else if (this.task.FIDs[this.FID].boxType === 'AND') {
      if (this.rating[e][this.cf] === -1) {
        this.rating[e][this.cf] = 1;
      } else {
        // можно отжимать
        this.rating[e][this.cf] = 1 - this.rating[e][this.cf];
      }
    }

    this.updateRating();
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

    this.updateRating();
  }

  updateRating() {
    if (this.task.FIDs[this.FID].boxType === 'AND') {
      this.rated[this.cf] = true;
    } else if (this.task.FIDs[this.FID].boxType === 'OR') {
      // должны быть оценены обе шкалы
      if ((this.rating[0][this.cf] === 0 || this.rating[1][this.cf] === 0) && (this.rating[2][this.cf] === 0 || this.rating[3][this.cf] === 0)) {
        this.rated[this.cf] = true;
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
      if (this.ytPlayer.getPlayerState() !== 1) {
        this.ytPlayer.playVideo();
      }
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
      // if (this.ytPlayer.getPlayerState() === 1) {
        this.ytPlayer.pauseVideo();
      // }
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
