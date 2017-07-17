import { Component } from '@angular/core';
import { CommonService } from '../../../common.service';
import { AnnotatingService } from '../../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-player-ratebar',
  templateUrl: './annotating-player-ratebar.component.html',
  styleUrls: ['./annotating-player-ratebar.component.scss']
})
export class AnnotatingPlayerRateBarComponent {
  constructor(public annot: AnnotatingService) {}
}
