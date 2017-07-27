import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../common.service';
import { AnnotatingService } from '../../../annotating/annotating.service';

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

  constructor(public annot: AnnotatingService) { }

  ngOnInit() {
    // при воспроизведении видео считаем процент просмотренной части
    this.annot.videoTurnedOn.subscribe(
      () => this.startWatching(),
      error => console.error(error)
    );

    // при паузе или остановке видео прекращаем считать
    this.annot.videoTurnedOff.subscribe(
      event => {
        this.stopWatching();

        // при остановке обнуляем прогресс
        if (event === 'stop') {
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
    if (this.annot.cf === -1) {
      // для целого видео
      this.fragmentStart = 0;
      this.fragmentEnd = this.annot.videoLength;
    } else {
      // для фрагмента
      this.fragmentStart = this.annot.csv[this.annot.cf][0];
      this.fragmentEnd = this.annot.csv[this.annot.cf][1];
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
          this.annot.unwatchVideo('pause');
        }

        // подсчёт прошедшего времени
        const timeSpent = currentTime - this.fragmentStart;

        // подсчёт процента воспроизведёного фрагмента
        this.percentage = (timeSpent / fragmentDuration * 100).toFixed(0);
      }

      // узнаём текущее время воспроизведения и подсчитываем процент для каждого плеера соответственно
      if (this.annot.isYouTube) {
        this.annot.ytPlayer.getCurrentTime().then((time) => {
          console.log(time);
          currentTime = time;
          countPercentage();
        });
      } else {
        currentTime = this.annot.videoContainer.currentTime;
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
