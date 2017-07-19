import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../common.service';
import { AnnotatingService } from '../../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-player-ratebar',
  templateUrl: './annotating-player-ratebar.component.html',
  styleUrls: ['./annotating-player-ratebar.component.scss']
})
export class AnnotatingPlayerRateBarComponent implements OnInit {
  emoType = this.annot.task.FIDs[this.annot.FID].emoType;

  constructor(public annot: AnnotatingService) {}

  ngOnInit() {
    this.annot.videoChanged.subscribe(
      () => this.emoType = this.annot.task.FIDs[this.annot.FID].emoType
    );
  }
}
