import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-annotating-player-ratebar',
  templateUrl: './annotating-player-ratebar.component.html',
  styleUrls: ['./annotating-player-ratebar.component.scss']
})
export class AnnotatingPlayerRateBarComponent {
  constructor(private common: CommonService) {}
}
