import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';
import YouTubePlayer from 'youtube-player';

@Component({
  selector: 'na-annotating-player-video',
  templateUrl: './annotating-player-video.component.html',
  styleUrls: ['./annotating-player-video.component.scss']
})
export class AnnotatingPlayerVideoComponent implements OnInit {
  currentVideo: string;

  constructor(private common: CommonService) { }

  ngOnInit() {
    $(document).ready(() => {
      const videoContainer = $('.video');
      const shield = $('.shield');

      let w = videoContainer.innerWidth();
      let h = w * 0.5625; // 9:16

      this.common.ytPlayer = YouTubePlayer('youtube', {
        width: w,
        height: h,
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

      this.loadVideo();
    });

    this.common.videoChanged.subscribe(
      success => {
        this.loadVideo();
      },
      error => {
        console.error(error);
      }
    );
  }

  checkIfYouTube() {
    if (this.common.task.fragments[this.common.task.currentFragment].video.substr(0, 17) === 'https://youtu.be/' ||
      this.common.task.fragments[this.common.task.currentFragment].video.substr(0, 32) === 'https://www.youtube.com/watch?v=') {
      this.common.isYouTube = true;
    } else {
      this.common.isYouTube = false;
    }
  }

  loadVideo() {
    this.checkIfYouTube();

    if (this.common.isYouTube) {
      const player = this.common.ytPlayer;

      const vid = this.common.task.fragments[this.common.task.currentFragment].video.slice(-11);
      player.loadVideoById(vid, () => {
        player.getDuration().then((time) => {
          this.common.videoLength = time;
          this.common.setFragment(-1);
        });
      });
    } else {
      this.common.videoContainer = document.getElementById('currentVideo');
      // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем видеозаписи
      // меняем источник видео
      this.currentVideo = this.common.task.fragments[this.common.task.currentFragment].video;
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
