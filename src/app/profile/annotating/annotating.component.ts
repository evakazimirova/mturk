import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../common.service';
import { AnnotatingService } from './annotating.service';

@Component({
  selector: 'na-annotating',
  templateUrl: './annotating.component.html',
  styleUrls: ['./annotating.component.scss']
})
export class AnnotatingComponent implements OnInit {
  percentage = this.common.projects[0].annoTask.percentage;
  constructor(public common: CommonService,
              public annot: AnnotatingService) {}

  ngOnInit() {
    this.annot.percentageUpdated.subscribe(
      (p) => {
        this.percentage = p;
      }
    );
  }
}
