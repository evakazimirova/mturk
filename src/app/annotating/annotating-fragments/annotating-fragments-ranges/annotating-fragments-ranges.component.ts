import { Component } from '@angular/core';
import { CommonService } from '../../../common.service';
import { AnnotatingService } from '../../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-fragments-ranges',
  templateUrl: './annotating-fragments-ranges.component.html',
  styleUrls: ['./annotating-fragments-ranges.component.scss']
})
export class AnnotatingFragmentsRangesComponent {
  constructor(public annot: AnnotatingService) {}
}
