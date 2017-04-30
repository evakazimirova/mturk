import { VideoPlayerService } from '../video-player.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-video-to-mark',
  templateUrl: './video-to-mark.component.html',
  styleUrls: ['./video-to-mark.component.scss']
})
export class VideoToMarkComponent implements OnInit {
  currentVideo: string;
  video: string = this.common.cv;

  constructor(private common: CommonService, private vp: VideoPlayerService) { }

  ngOnInit() {
    this.currentVideo = this.common.conf.pathToData + this.video + ".mp4";
    this.vp.videoContainer = document.getElementById('videoToMark');
    this.vp.videoContainer.load();

    this.vp.videoContainer.addEventListener('loadedmetadata', () => {
      this.vp.videoLength = +(this.vp.videoContainer.duration).toFixed(2);
    });
  }
}
