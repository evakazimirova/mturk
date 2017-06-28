import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';
import YouTubePlayer from 'youtube-player';

@Component({
  selector: 'na-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  currentVideo: string;

  constructor(private common: CommonService) { }

  ngOnInit() {
    const videoContainer = $('.video');
    const shield = $('.shield');

    let w = videoContainer.innerWidth();
    let h = w * 0.5625; // 9:16

    shield.innerWidth(w);
    shield.innerHeight(h);

    $(window).resize(() => {
      w = videoContainer.innerWidth();
      if (this.common.isYouTube) {
        h = w * 0.5625; // 9:16
        this.common.ytPlayer.setSize(w, h);
      } else {
        h = videoContainer.innerHeight();
      }
      shield.innerWidth(w);
      shield.innerHeight(h);
    });

    if (this.common.task.video.substr(0, 17) === 'https://youtu.be/' ||
      this.common.task.video.substr(0, 32) === 'https://www.youtube.com/watch?v=') {
      this.common.isYouTube = true;
    } else {
      this.common.isYouTube = false;
    }

    if (this.common.isYouTube) {
      $(document).ready(() => {
        const vid = this.common.task.video.slice(-11);
        this.common.ytPlayer = YouTubePlayer('youtube', {
          width: w,
          height: h,
          videoId: vid,
          playerVars: {
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0
          },
        });
        const player = this.common.ytPlayer;

        // player.on('ready', (event) => {
        // });

        player.getDuration().then((time) => {
          this.common.videoLength = time;
          this.common.setFragment(-1);
        });

        // player.loadVideoById(vid);
        // player.setSize(847, 476);
        // player.playVideo();

        // player.getCurrentTime()

        // player.getPlayerState():Number // Возвращает состояние проигрывателя. Возможные значения:
        // -1 – воспроизведение видео не началось
        // 0 – воспроизведение видео завершено
        // 1 – воспроизведение
        // 2 – пауза
        // 3 – буферизация
        // 5 – видео находится в очереди

        // player.getDuration()

        // player.loadVideoByUrl({
        //   mediaContentUrl: `http://www.youtube.com/v/${vid}?version=3`,
        //   startSeconds: 30,
        //   endSeconds: 44
        // });

        // player.seekTo(10, false);
      });
    } else {
      this.common.videoContainer = document.getElementById('currentVideo');

      // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем видеозаписи

      // меняем источник видео
      this.currentVideo = this.common.task.video;
      this.common.videoContainer.load();

      this.common.videoContainer.addEventListener('loadeddata', () => {
        this.common.videoLength = this.common.videoContainer.duration;

        if (this.common.mode === "fragmentsRating") {
          this.common.setFragment(-1); // запускаем видео целиком
        }

        if (this.common.mode === "fragmentsMarking") {
          this.common.unwatchVideo('stop');
        }
      }, false);

      // // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
      // this.common.videoContainer.currentTime = this.common.csv[this.common.cf][1];

      // ДОП 1. сделать возможность просматривать весь видеофайл (это необходимо сделать аннотаторам перед разметкой каждого видео, по умолчанию выбор нового видео должен приводить к тому что включается воспроизведение видео без фрагментов). То есть должна быть кнопка в управлении, которая запускает видео таймлайн при этом это длина всего файла. Когда такой тип воспроизведения активен, соответствующая кнопка подсвечивается, чтобы перейти к разметке надо ее отжать, либо выбрать фрагмент.
      this.common.videoContainer.currentTime = 0;
      // this.common.updateCSV();
    }
  }
}
