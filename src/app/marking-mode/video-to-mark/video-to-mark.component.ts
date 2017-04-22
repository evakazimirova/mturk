import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-video-to-mark',
  templateUrl: './video-to-mark.component.html',
  styleUrls: ['./video-to-mark.component.scss']
})
export class VideoToMarkComponent implements OnInit {
  currentVideo: string;
  video: string = "sharapova";
  videoContainer;

  constructor(private common: CommonService) { }

  ngOnInit() {
    this.videoContainer = document.getElementById('videoToMark');

    this.currentVideo = this.common.conf.pathToData + this.video + ".mp4";
    this.videoContainer.load();
  }

}
