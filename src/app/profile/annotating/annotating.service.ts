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
  isPersonShown = false;
  controlsAreSet = false;
  isClickingFirstFragment = false;
  demoMode = false;

  demoHints = [
    "Посмотрите на изображение. Ваша задача – выбирать те состояния (чувства, эмоции и т.д.), которые испытывает этот человек. Let’s start!",
    "Нажмите кнопку плей (картинка с кнопкой?) чтобы посмотреть видео целиком. Это необходимо сделать перед разметкой для понимания контекста.",
    "Просмотрите короткий фрагмент из видео. Под видео находятся кнопки с эмоциями. Посмотрите, испытывает ли в этом фрагменте человек какие-то из этих эмоций?",
    "Нажми кнопку с нужной эмоцией. Ты можешь выбрать несколько эмоций! Если ты не увидел ничего из указанных состояний, нажми None.",
    "Справа в таблице появилась ваша отметка (стрелка?). Вы можете ее изменить в любой момент, вернувшись к этому фрагменту, до сдачи таска. [кнопка ок?]",
    "Теперь просмотрите следующий фрагмент и также отметьте эмоцию на нижней шкале",
    "В данном фрагменте человек не испытывает ничего из перечисленного ниже. В таких случаях нужно ставить <strong>None.</strong>",
    "В одном задании всегда будет несколько видео (ведь так интересней!). Теперь нужно отметить эмоции этого человека.",
    "Когда ты видишь в кадре двоих людей, твоя задача отмечать эмоции именно того человека, который был указан в начале этого видео! Здесь это Eddie Redmayne, не перепутай! Кажется, он не испытывает ничего из указанного ниже, согласен? Тогда снова ставь <strong>None</strong>!",
    "Здесь, как нам кажется, человек испытывает сразу две эмоции: <strong>Surprise</strong> and <strong>Angry</strong>. Согласен? Отметь обе!",
    "Для того, чтобы сдать задачу и получить оплату, нажми кнопку 'Save & play next video'"
  ];
  demoHint = 0;

  isYouTube: boolean;
  ytPlayer;

  // события
  videoChanged = new EventEmitter();
  fragmentChanged = new EventEmitter();
  fragmentRated = new EventEmitter();
  percentageUpdated = new EventEmitter();

  rightCol;
  rightColTable;

  constructor(private common: CommonService) {}

  updatePercentage(tasksDone) {
    const newPart = +(tasksDone / this.task.FIDs.length).toFixed(2);
    const newPercentage = newPart * 100;
    this.common.projects[0].annoTask.percentage = newPercentage;
    this.common.projects[0].annoTask.earned = +(newPart * this.common.projects[0].annoTask.price).toFixed(0);

    this.percentageUpdated.emit(newPercentage);
  }

  setFragment(number) {
    if (this.demoMode) {
      if (this.cf === -1 && this.demoHint === 1 && this.FID == 0) {
        this.demoHint = 2;
      } else if (this.demoHint === 4) {
        this.demoHint = 5;
      } else if (this.demoHint === 5) {
        this.demoHint = 6;
      } else if (this.FID == 1 && number === 1) {
        this.demoHint = 8;
      } else if (this.FID == 2 && number === 2) {
        this.demoHint = 9;
      } else if (this.demoHint === 9) {
        this.demoHint = 10;
      }
    }

    const getFragmentPosition = (number) => {
      // не выходим за пределы таблицы
      if (number >= -1 && number < this.csv.length) {
        this.cf = number;
        let fragmentPosition = 0;
        if (number >= 0) {
          fragmentPosition = this.csv[number][0]
        }

        return fragmentPosition;
      }
    }

    this.unwatchVideo('pause');
    this.rightCol.scrollTop(35.56 * number);
    const fragmentPosition = (getFragmentPosition(number));

    // выбираем плеер
    if (this.isYouTube) {
      this.ytPlayer.seekTo(fragmentPosition, true);
    } else {
      this.videoContainer.currentTime = fragmentPosition;
    }

    if (number === 0 && !(this.demoMode && (this.demoHint === 2 || (this.FID > 0 && this.demoHint === -1)))) {
      this.isPersonShown = true;
      this.isClickingFirstFragment = true;
      setTimeout(() => {
        this.isClickingFirstFragment = false;
      }, 100);
    } else {
      if (!((this.demoMode && (this.demoHint === 1 || this.demoHint === 7)))) {
        this.fragmentChanged.emit(fragmentPosition);
      }
    }
  }

  updateCSV(newCSV) {
    newCSV.shift();

    this.rating = [];
    this.rated = [];

    const totalEmotions = this.task.FIDs[this.FID].emotions.length;
    const totalFragments = newCSV.length;

    // проставляем рейтинг
    const rated = this.task.FIDs[this.FID].result.csv[0] === 'S'
    for (let j = 0; j < totalFragments; j++) {
      this.rated.push(rated);
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
    if (this.demoMode) {
      if (this.demoHint === 3) {
        this.demoHint = 4;
      }
    }

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
    if (this.demoMode && this.demoHint === 3) {
      this.demoHint = 4;
    }

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
    // if (!this.allFragmentsRated) {
    //   itsOk = confirm('Разметка этого видео не сохранена. Вы уверены, что хотите перейти к разметке другого видео без сохранения?');
    // }

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
