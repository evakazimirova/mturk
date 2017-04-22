import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'na-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  constructor(private common: CommonService) { }

  ngOnInit() {
    // Обработка нажатий клавиш
    $(document).keyup((e) => {
      // 7. Оценка фрагменту выставляется с помощью кнопок в web-интерфейсе или по нажатию клавиш 1 2 3 4 5.
      if (e.keyCode >= 49 && e.keyCode <= 53) {
        this.common.rateFragment(e.key);
      }

      // 9. Переход между фрагментами осуществляется с помощью соответствующих кнопок на интерфейсе или стрелками на клавиатуре.
      if (e.keyCode === 37) { // влево
        this.common.setFragment(this.common.cf - 1);
      }

      if (e.keyCode === 39) { // вправо
        this.common.setFragment(this.common.cf + 1);
      }

      // Повторить фрагмент
      if (e.keyCode === 40) { // вниз
        this.replayVideo();
      }

      // Смена шкалы оценивания
      // 10. Смена шкалы оценивания осуществляется нажатием клавиши Right Shift или в соответствующем списке интерфейса.
      if (e.keyCode === 16) { // Shift
        // this.replayVideo();
        if(this.common.emotion === this.common.conf.emotions.length - 1) {
          this.common.emotion = 0;
        } else {
          this.common.emotion++;
        }
        this.common.cf = 0;
      }

      // console.log(e.keyCode);
    });

    // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
    // 6. При выборе фрагмента из списка происходит его воспроизведение. В списке воспроизводимый в текущий момент фрагмент помечается.
    this.common.fragmentChanged.subscribe(
      (fragmentPosition) => {
        this.common.unwatchVideo("stop");
        this.common.videoContainer.currentTime = fragmentPosition;

        this.playVideo();
      },
      (error) => console.log(error)
    );
  }

  // 8. Остановка/пауза/продолжение воспроизведения фрагмента осуществляется через соотв. кнопки в web-интерфейсе.
  playVideo() {
    this.common.watchVideo();
  }

  pauseVideo() {
    this.common.unwatchVideo("pause");
  }

  stopVideo() {
    this.common.unwatchVideo("stop");
  }

  replayVideo() {
    this.common.videoContainer.currentTime = this.common.csv[this.common.cf][1]; // возвращаемся в начало фрагмента
    this.playVideo();
  }
}
