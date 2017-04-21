import { HttpService } from '../http.service';
import { PushService } from '../push.service';
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

  constructor(private push: PushService, private http: HttpService) { }

  ngOnInit() {
    // читаем файл конфигурации
    // this.http.get('./assets/conf.json').subscribe(
    //   (conf) => {
    //     this.pathToData = conf.pathToData;
    //   },
    //   (error) => console.log(error)
    // );

    this.videoContainer = document.getElementById('currentVideo');

    // 7. Оценка фрагменту выставляется с помощью кнопок в web-интерфейсе или по нажатию клавиш 1 2 3 4 5.
    $(document).keypress((e) => {
      if (e.keyCode >= 49 && e.keyCode <= 53) {
        this.push.saveThisMark(e.key);
      }
    });

    // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем видеозаписи
    this.push.currentVideo.subscribe(
      (video) => {
        this.currentVideo = video + ".mp4";
        this.videoContainer.load();
        // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
        this.videoContainer.currentTime = 20;
      },
      (error) => console.log(error)
    );

    // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
    this.push.currentVideoPosition.subscribe(
      (fragmentPosition) => {
        this.videoContainer.currentTime = fragmentPosition;
      },
      (error) => console.log(error)
    );
  }

  playVideo() {
    if(this.videoContainer.paused) {
      let fragmentStart = this.push.csv[this.push.cf][1];
      let fragmentEnd = this.push.csv[this.push.cf][2];
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
    this.videoContainer.currentTime = this.push.csv[this.push.cf][1]; // возвращаемся в начало фрагмента
    this.percentage = 0;
  }

  replayVideo() {
    this.videoContainer.currentTime = this.push.csv[this.push.cf][1]; // возвращаемся в начало фрагмента
  }
}
