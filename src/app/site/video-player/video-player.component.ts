import { HttpService } from '../http.service';
import { CommonService } from '../common.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'na-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  pathToData: string;
  currentVideo: string;
  watchingVideo;
  videoContainer;
  percentage: string | number = 0;

  constructor(private common: CommonService, private http: HttpService) { }

  ngOnInit() {
    // читаем файл конфигурации
    // this.http.get('./assets/conf.json').subscribe(
    //   (conf) => {
    //     this.pathToData = conf.pathToData;
    //   },
    //   (error) => console.log(error)
    // );

    this.videoContainer = document.getElementById('currentVideo');

    // Отработка нажатий клавиш
    $(document).keyup((e) => {
      // 7. Оценка фрагменту выставляется с помощью кнопок в web-интерфейсе или по нажатию клавиш 1 2 3 4 5.
      if (e.keyCode >= 49 && e.keyCode <= 53) {
        this.common.saveThisMark(e.key);
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
      }

      // console.log(e.keyCode);
    });

    // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем видеозаписи
    this.common.currentVideo.subscribe(
      (video) => {
        this.currentVideo = video + ".mp4";
        this.videoContainer.load();
        // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
        this.videoContainer.currentTime = 20;
      },
      (error) => console.log(error)
    );

    // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
    // 6. При выборе фрагмента из списка происходит его воспроизведение. В списке воспроизводимый в текущий момент фрагмент помечается.
    this.common.currentVideoPosition.subscribe(
      (fragmentPosition) => {
        this.pauseVideo();
        this.videoContainer.currentTime = fragmentPosition;
        this.percentage = 0;
        this.playVideo();
      },
      (error) => console.log(error)
    );
  }

  // 8. Остановка/пауза/продолжение воспроизведения фрагмента осуществляется через соотв. кнопки в web-интерфейсе.
  playVideo() {
    if(this.videoContainer.paused) {
      let fragmentStart = this.common.csv[this.common.cf][1];
      let fragmentEnd = this.common.csv[this.common.cf][2];
      let fragmentDuration = fragmentEnd - fragmentStart;

      let updateProgressBar = () => {
        let currentTime = this.videoContainer.currentTime;

        // проиграв фрагмент, останавливаем видео
        if(this.videoContainer.currentTime >= fragmentEnd) {
          this.stopVideo();
        }

        let timeSpent = currentTime - fragmentStart;
        this.percentage = (timeSpent / fragmentDuration * 100).toFixed(0);
      }

      this.watchingVideo = setInterval(updateProgressBar, 50);
      this.videoContainer.play();
    }
  }

  pauseVideo() {
    clearInterval(this.watchingVideo);
    this.videoContainer.pause();
  }

  stopVideo() {
    this.pauseVideo(); // останавливаемся
    this.videoContainer.currentTime = this.common.csv[this.common.cf][1]; // возвращаемся в начало фрагмента
    this.percentage = 0;
  }

  replayVideo() {
    this.videoContainer.currentTime = this.common.csv[this.common.cf][1]; // возвращаемся в начало фрагмента
    this.playVideo();
  }
}
