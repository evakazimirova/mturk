import { CommonService } from '../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-marking-mode',
  templateUrl: './marking-mode.component.html',
  styleUrls: ['./marking-mode.component.scss']
})
export class MarkingModeComponent implements OnInit {
  video = "sharapova";

  constructor(private common: CommonService) { }

  ngOnInit() {
    this.common.unwatchVideo('stop'); // выключаем видео основного плеера
  }

}