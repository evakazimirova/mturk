import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-annotating-fragments-ranges',
  templateUrl: './annotating-fragments-ranges.component.html',
  styleUrls: ['./annotating-fragments-ranges.component.scss']
})
export class AnnotatingFragmentsRangesComponent implements OnInit {

  constructor(private common: CommonService) {}

  ngOnInit() {}
}
