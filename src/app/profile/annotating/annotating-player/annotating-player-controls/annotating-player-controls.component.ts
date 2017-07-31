import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../common.service';
import { AnnotatingService } from '../../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-player-controls',
  templateUrl: './annotating-player-controls.component.html',
  styleUrls: ['./annotating-player-controls.component.scss']
})
export class AnnotatingPlayerControlsComponent implements OnInit {
  constructor(private common: CommonService,
              public annot: AnnotatingService) { }

  ngOnInit() {
    // Обработка нажатий клавиш
    $(document).keyup((e) => {
      const isBucketEmotionsMode = this.annot.task.FIDs[this.annot.FID].boxType === 'OR' || this.annot.task.FIDs[this.annot.FID].boxType === 'AND';

      if (this.common.profileMode === 'annotating') {
        if (e.keyCode >= 49 && e.keyCode <= 53 || e.keyCode === 81 || e.keyCode === 87 || e.keyCode === 69) { // 1, 2, 3, 4, 5, q, w, e
          // не оцениваем видео целиком
          if (this.annot.cf !== -1) {
            if (!isBucketEmotionsMode) {
              // оценка шкал 1–5 и -2–2
              if (e.keyCode >= 49 && e.keyCode <= 53) { // 1, 2, 3, 4, 5
                // Оценка фрагмента
                this.annot.rateFragment(e.key);
              }
            } else if (this.annot.task.FIDs[this.annot.FID].boxType === 'OR') {
              // оценка шкалы OR
                     if (e.keyCode === 49) { // 1
                this.annot.checkEmo(0);
              } else if (e.keyCode === 50) { // 2
                this.annot.uncheckEmos(0, 1);
              } else if (e.keyCode === 51) { // 3
                this.annot.checkEmo(1);
              } else if (e.keyCode === 81) { // q
                this.annot.checkEmo(2);
              } else if (e.keyCode === 87) { // w
                this.annot.uncheckEmos(2, 3);
              } else if (e.keyCode === 69) { // e
                this.annot.checkEmo(3);
              }
            } else if (this.annot.task.FIDs[this.annot.FID].boxType === 'AND') {
              // оценка шкалы AND
              if (e.keyCode === 49) { // 1
                this.annot.uncheckEmos('all');
              } else if (e.keyCode >= 50 && e.keyCode <= 52) { // 2, 3, 4
                this.annot.checkEmo(e.keyCode - 50);
              }
            }
          }
        } else if (e.keyCode === 37) { // стрелка влево
          // Предыдущий фрагмент
          this.annot.setFragment(this.annot.cf - 1);
        } else if (e.keyCode === 39) { // стрелка вправо
          // Следующий фрагмент
          this.annot.setFragment(this.annot.cf + 1);
        } else if (e.keyCode === 40) { // стрелка вниз
          // Повторить фрагмент
          this.replayVideo();
        } else if (e.keyCode === 16) { // shift
          if (!isBucketEmotionsMode) {
            // Смена шкалы оценивания
            if(this.annot.emotion === this.annot.task.FIDs[this.annot.FID].emotions.length - 1) {
              // Возвращаемся к первой эмоции
              this.annot.emotion = 0;
            } else {
              // Следующая эмоция
              this.annot.emotion++;
            }
            // Переходим к первому фрагменту
            this.annot.cf = 0;
          }
        }
      }
    });

    // При выборе фрагмента из списка происходит его воспроизведение
    this.annot.fragmentChanged.subscribe(
      fragmentPosition => {
        // выбираем плеер
        if (this.annot.isYouTube) {
          this.annot.ytPlayer.seekTo(fragmentPosition, true);
        } else {
          this.annot.videoContainer.currentTime = fragmentPosition;
        }

        // воспроизводим фрагмент
        this.playVideo();
      },
      error => console.error(error)
    );
  }

  // Воспроизведение
  playVideo() {
    this.annot.watchVideo();
  }

  // Пауза
  pauseVideo() {
    this.annot.unwatchVideo('pause');
  }

  // Остановка
  stopVideo() {
    this.annot.unwatchVideo('stop');
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
    if(this.annot.cf === -1) {
      this.annot.setFragment(0);
    } else {
      this.annot.setFragment(-1);
    }
  }
}
