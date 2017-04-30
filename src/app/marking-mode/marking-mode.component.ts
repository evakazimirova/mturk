import { VideoPlayerService } from './video-player.service';
import { CommonService } from '../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-marking-mode',
  templateUrl: './marking-mode.component.html',
  styleUrls: ['./marking-mode.component.scss']
})
export class MarkingModeComponent implements OnInit {
  video: string = this.common.cv;

  constructor(private common: CommonService, private vp: VideoPlayerService) { }

  ngOnInit() {
    this.common.unwatchVideo('stop'); // выключаем видео основного плеера
  }

}