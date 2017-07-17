import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../common.service';

@Component({
  selector: 'na-annotating-player-controls',
  templateUrl: './annotating-player-controls.component.html',
  styleUrls: ['./annotating-player-controls.component.scss']
})
export class AnnotatingPlayerControlsComponent implements OnInit {
  constructor(private common: CommonService) { }

  ngOnInit() {
    // Обработка нажатий клавиш
    $(document).keyup((e) => {
      if(this.common.mode === 'fragmentsRating') {
        if (e.keyCode >= 49 && e.keyCode <= 53) { // клавиши 1, 2, 3, 4, 5
          // Оценка фрагмента
          this.common.rateFragment(e.key);
        } else if (e.keyCode === 37) { // стрелка влево
          // Предыдущий фрагмент
          this.common.setFragment(this.common.cf - 1);
        } else if (e.keyCode === 39) { // стрелка вправо
          // Следующий фрагмент
          this.common.setFragment(this.common.cf + 1);
        } else if (e.keyCode === 40) { // стрелка вниз
          // Повторить фрагмент
          this.replayVideo();
        } else if (e.keyCode === 16) { // shift
          // Смена шкалы оценивания
          if(this.common.emotion === this.common.task.emotions.length - 1) {
            // Возвращаемся к первой эмоции
            this.common.emotion = 0;
          } else {
            // Следующая эмоция
            this.common.emotion++;
          }
          // Переходим к первому фрагменту
          this.common.cf = 0;
        }
      }
    });

    // При выборе фрагмента из списка происходит его воспроизведение
    this.common.fragmentChanged.subscribe(
      fragmentPosition => {
        // выбираем плеер
        if (this.common.isYouTube) {
          this.common.ytPlayer.seekTo(fragmentPosition, true);
        } else {
          this.common.videoContainer.currentTime = fragmentPosition;
        }

        // воспроизводим фрагмент
        this.playVideo();
      },
      error => console.error(error)
    );
  }

  // Воспроизведение
  playVideo() {
    this.common.watchVideo();
  }

  // Пауза
  pauseVideo() {
    this.common.unwatchVideo('pause');
  }

  // Остановка
  stopVideo() {
    this.common.unwatchVideo('stop');
  }

  // Повторить фрагмент
  replayVideo() {
    // останавливаем видео
    this.stopVideo();
    // воспроизводим видео
    this.playVideo();
  }

  // Видео целиком
  wholeVideo() {
    // Воспроизводим видел целиком, либо первый фрагмент
    if(this.common.cf === -1) {
      this.common.setFragment(0);
    } else {
      this.common.setFragment(-1);
    }
  }
}
