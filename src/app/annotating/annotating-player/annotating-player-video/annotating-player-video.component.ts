import { Component, OnInit } from '@angular/core';
import YouTubePlayer from 'youtube-player';
import { CommonService } from '../../../common.service';
import { AnnotatingService } from '../../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-player-video',
  templateUrl: './annotating-player-video.component.html',
  styleUrls: ['./annotating-player-video.component.scss']
})
export class AnnotatingPlayerVideoComponent implements OnInit {
  currentVideo: string;

  constructor(public annot: AnnotatingService) { }

  ngOnInit() {
    $(document).ready(() => {
      // находитм все DOM-элементы
      const videoContainer = $('.video');
      const shield = $('.shield');
      this.annot.videoContainer = document.getElementById('currentVideo');

      // настраиваем YouTube-плеер
      this.annot.ytPlayer = YouTubePlayer('youtube', {
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

      // задём размеры плеера
      const setSize = () => {
        // вычисляем размеры плеера
        const w = videoContainer.innerWidth();
        // h = videoContainer.innerHeight();
        const h = w * 0.5625; // 9:16

        this.annot.ytPlayer.setSize(w, h);
        shield.innerWidth(w);
        shield.innerHeight(h);
      };
      setSize();
      // обновляем размеры плеера при изменнии размера окна браузера
      $(window).resize(setSize);

      // запускаем видео при заходе на страницу
      this.loadVideo();
    });

    // загрузка видео по запросу
    this.annot.videoChanged.subscribe(
      success => this.loadVideo(),
      error => console.error(error)
    );
  }

  // проверка источника видео и назначение плеера
  checkIfYouTube() {
    if (this.annot.task.FIDs[this.annot.FID].video.substr(0, 17) === 'https://youtu.be/' ||
      this.annot.task.FIDs[this.annot.FID].video.substr(0, 32) === 'https://www.youtube.com/watch?v=') {
      this.annot.isYouTube = true;
    } else {
      this.annot.isYouTube = false;
    }
  }

  // загружаем видео
  loadVideo() {
    // проверяем, какой плеер нужно использовать
    this.checkIfYouTube();

    if (this.annot.isYouTube) {
      // YouTube
      const player = this.annot.ytPlayer;

      // указываем видео с YouTube
      const vid = this.annot.task.FIDs[this.annot.FID].video.slice(-11);
      player.loadVideoById(vid, () => {
        player.getDuration().then((time) => {
          // задаём длительность видео
          this.annot.videoLength = time;
          // запускаем видео целиком
          this.annot.setFragment(-1);
        });
      });
    } else {
      // Стандартный HTML5
      // меняем источник видео
      this.currentVideo = this.annot.task.FIDs[this.annot.FID].video;

      // загружаем видео
      this.annot.videoContainer.load();
      this.annot.videoContainer.addEventListener('loadeddata', () => {
        // задаём длительность видео
        this.annot.videoLength = this.annot.videoContainer.duration;
        // запускаем видео целиком
        this.annot.setFragment(-1);
      }, false);
    }
  }
}
