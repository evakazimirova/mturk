import { Component } from '@angular/core';
import { CommonService } from '../../../common.service';

@Component({
  selector: 'na-annotating-player-ratebar',
  templateUrl: './annotating-player-ratebar.component.html',
  styleUrls: ['./annotating-player-ratebar.component.scss']
})
export class AnnotatingPlayerRateBarComponent {
  constructor(private common: CommonService) {}
}
