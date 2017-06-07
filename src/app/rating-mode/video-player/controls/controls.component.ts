import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';

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
      if(this.common.mode === "fragmentsRating") {
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
          if(this.common.emotion === this.common.task.emotions.length - 1) {
            this.common.emotion = 0;
          } else {
            this.common.emotion++;
          }
          this.common.cf = 0;
        }

        // console.log(e.keyCode);
      }
    });

    // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
    // 6. При выборе фрагмента из списка происходит его воспроизведение. В списке воспроизводимый в текущий момент фрагмент помечается.
    this.common.fragmentChanged.subscribe(
      (fragmentPosition) => {
        this.stopVideo();
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
    if (this.common.cf === -1) {
      this.common.videoContainer.currentTime = 0;
    } else {
      this.common.videoContainer.currentTime = this.common.csv[this.common.cf][1];
    }
    this.playVideo();
  }

  // ДОП 1. сделать возможность просматривать весь видеофайл (это необходимо сделать аннотаторам перед разметкой каждого видео, по умолчанию выбор нового видео должен приводить к тому что включается воспроизведение видео без фрагментов). То есть должна быть кнопка в управлении, которая запускает видео таймлайн при этом это длина всего файла. Когда такой тип воспроизведения активен, соответствующая кнопка подсвечивается, чтобы перейти к разметке надо ее отжать, либо выбрать фрагмент.
  wholeVideo() {
    if(this.common.cf === -1) {
      this.common.setFragment(0);
    } else {
      this.common.setFragment(-1);
    }
  }
}
