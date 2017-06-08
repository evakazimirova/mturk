import { VideoPlayerService } from './video-player.service';
import { CommonService } from '../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-marking-mode',
  templateUrl: './marking-mode.component.html',
  styleUrls: ['./marking-mode.component.scss']
})
export class MarkingModeComponent implements OnInit {
  video: string = this.common.task.video;

  constructor(public common: CommonService, private vp: VideoPlayerService) { }

  ngOnInit() {
    // this.vp.task = this.common.task.tasks[0].EID;

    // this.common.unwatchVideo('stop'); // выключаем видео основного плеера

    // Создаём массив для разбивки фрагменов для всех задач
    for (let i in this.common.task.events) {
      this.vp.fragments.push([]);
    }
  }

  return() {
    this.common.mode = 'profile';
  }
}