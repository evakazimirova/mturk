import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../common.service';
import { AnnotatingService } from '../../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-player-ratebar',
  templateUrl: './annotating-player-ratebar.component.html',
  styleUrls: ['./annotating-player-ratebar.component.scss']
})
export class AnnotatingPlayerRateBarComponent implements OnInit {
  boxType = this.annot.task.FIDs[this.annot.FID].boxType;

  constructor(public annot: AnnotatingService) {}

  ngOnInit() {
    this.annot.videoChanged.subscribe(
      () => this.boxType = this.annot.task.FIDs[this.annot.FID].boxType
    );
  }
}
