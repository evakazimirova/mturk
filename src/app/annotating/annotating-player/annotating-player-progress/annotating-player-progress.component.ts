import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-annotating-player-progress',
  templateUrl: './annotating-player-progress.component.html',
  styleUrls: ['./annotating-player-progress.component.scss']
})
export class AnnotatingPlayerProgressComponent implements OnInit {
  // параметры по умолчанию
  percentage: string | number = 0;
  fragmentStart = 0;
  fragmentEnd = 0;

  // свойство для таймера
  watchingVideo;

  constructor(private common: CommonService) { }

  ngOnInit() {
    // при воспроизведении видео считаем процент просмотренной части
    this.common.videoTurnedOn.subscribe(
      () => this.startWatching(),
      error => console.error(error)
    );

    // при паузе или остановке видео прекращаем считать
    this.common.videoTurnedOff.subscribe(
      event => {
        this.stopWatching();

        // при остановке обнуляем прогресс
        if (event === "stop") {
          this.percentage = 0;
        }
      },
      error => console.error(error)
    );
  }

  startWatching() {
    // очищаем таймер, если уже запущен
    if (this.watchingVideo !== undefined) {
      if (this.watchingVideo._zoneDelegates !== null) {
        clearInterval(this.watchingVideo);
      }
    }

    // задаём начало и конец воспроизвденеия
    if (this.common.cf === -1) {
      // для целого видео
      this.fragmentStart = 0;
      this.fragmentEnd = this.common.videoLength;
    } else {
      // для фрагмента
      this.fragmentStart = this.common.csv[this.common.cf][0];
      this.fragmentEnd = this.common.csv[this.common.cf][1];
    }
    // задаём длину фрагмента
    const fragmentDuration = this.fragmentEnd - this.fragmentStart;

    // функция обновления полосы воспроизведения
    const updateProgressBar = () => {
      let currentTime;

      // функция подсчёта процента воспроизведёного фрагмента
      const countPercentage = () => {
        // проиграв фрагмент, ставим видео на паузу
        if (currentTime >= this.fragmentEnd) {
          this.common.unwatchVideo('pause');
        }

        // подсчёт прошедшего времени
        const timeSpent = currentTime - this.fragmentStart;

        // подсчёт процента воспроизведёного фрагмента
        this.percentage = (timeSpent / fragmentDuration * 100).toFixed(0);
      }

      // узнаём текущее время воспроизведения и подсчитываем процент для каждого плеера соответственно
      if (this.common.isYouTube) {
        this.common.ytPlayer.getCurrentTime().then((time) => {
          currentTime = time;
          countPercentage();
        });
      } else {
        currentTime = this.common.videoContainer.currentTime;
        countPercentage();
      }
    };

    // начинаем отслеживать прогресс воспроизведения
    this.watchingVideo = setInterval(updateProgressBar, 50);
  }

  stopWatching() {
    clearInterval(this.watchingVideo);
  }
}
