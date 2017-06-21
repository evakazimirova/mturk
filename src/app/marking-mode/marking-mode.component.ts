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

    // очищаем кэш
    this.vp.fragments = [];
    this.vp.task = 0;
    this.vp.cf = -1;
    this.vp.videoLength = 0;
    this.vp.timelineWidth = 0;
    this.vp.tickPosition = 0;
    this.vp.videoPosition = 0;
    this.vp.startFragment = 0;
    this.vp.endFragment = 0;
    this.vp.isComplete = false;

    // Создаём массив для разбивки фрагменов для всех задач
    for (let i in this.common.task.events) {
      this.vp.fragments.push([]);
    }
  }

  return() {
    const confirmed = confirm('Are you sure you want to leave the task without saving progress?');

    if (confirmed) {
      this.common.mode = 'profile';
    }
  }
}