import { Component, OnInit } from '@angular/core';
import YouTubePlayer from 'youtube-player';
import { VideoPlayerService } from '../video-player.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'na-video-to-mark',
  templateUrl: './video-to-mark.component.html',
  styleUrls: ['./video-to-mark.component.scss']
})
export class VideoToMarkComponent implements OnInit {
  currentVideo: string;
  video: string = this.common.task.video;

  constructor(private common: CommonService, private vp: VideoPlayerService) { }

  ngOnInit() {
    $(document).ready(() => {
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

      setTimeout(() => { // чтобы this.common.isYouTube применилась
        if (this.common.isYouTube) {
          const vid = this.common.task.video.slice(-11);
          this.vp.videoContainer = YouTubePlayer('youtube', {
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
          const player = this.vp.videoContainer;

          player.getDuration().then((time) => {
            this.vp.videoLength = time;
            // this.common.videoLength = time;
            // this.common.setFragment(-1);
          });
        } else {
          this.currentVideo = this.common.task.video;
          this.vp.videoContainer = document.getElementById('videoToMark');
          this.vp.videoContainer.load();

          this.vp.videoContainer.addEventListener('loadedmetadata', () => {
            this.vp.videoLength = +(this.vp.videoContainer.duration).toFixed(2);
          });
        }
      }, 0);
    });
  }
}
