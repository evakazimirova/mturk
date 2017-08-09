import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../common.service';
import { AnnotatingService } from './annotating.service';

@Component({
  selector: 'na-annotating',
  templateUrl: './annotating.component.html',
  styleUrls: ['./annotating.component.scss']
})
export class AnnotatingComponent implements OnInit {
  percentage = 0;
  constructor(public common: CommonService,
              public annot: AnnotatingService) {}

  ngOnInit() {
    this.common.tutorial = 0;

    if (!this.annot.demoMode) {
      this.percentage = this.common.projects[0].annoTask.percentage;

      this.common.alert(`
        Attention, please!
        The present task contains new emotion scale.
        For meeting the target, you should improve your skills and do <a href="#" data-dismiss="modal" data-toggle="modal" data-target=".tutorial-modal">a tutorial</a> training any time you want.
        Don’t worry, it only takes a couple of minutes.
        <strong>Please consider that it’s not possible to complete the task without the training passed.</strong>
      `);

      const reminder = () => {
        this.common.alert(`Hi! Just to remind you that your tutorial training is not completed yet. Please, do it asap for finishing the actual task.`, () => {
          setTimeout(reminder, 30 * 60 * 1000);
        });
      }
      setTimeout(reminder, 30 * 60 * 1000);
    }

    this.annot.percentageUpdated.subscribe(
      (p) => {
        this.percentage = p;
      }
    );
  }
}
