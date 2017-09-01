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
    if (!this.annot.demoMode) {
      this.percentage = this.common.projects[0].annoTask.percentage;

      let tutorialChosen = false;
      this.common.tutorialDone = false;

      for (let group in this.common.emotionGroups) {
        if (tutorialChosen) {
          break;
        }

        for (let EID of this.common.emotionGroups[group]) {
          if (this.annot.task.FIDs[0].emotions[0] === EID) {
            this.common.tutorial = group;
            tutorialChosen = true;
            break;
          }
        }
      }

      if (this.testPassed()) {
        tutorialChosen = false;
        this.common.tutorialDone = true;
      }

      if (tutorialChosen) {
        const reminder = () => {
          this.annot.unwatchVideo('pause');

          this.common.alert(`Hi! Just to remind you that your tutorial training is not completed yet. Please, do it asap for finishing the actual task.`, () => {
            this.annot.reminder = setTimeout(reminder, 30 * 60 * 1000);
          });
        };

        this.common.alert(`
          Attention, please!
          The present task contains new emotion scale.
          For meeting the target, you should improve your skills and do <a href="#" data-dismiss="modal">a tutorial</a> training any time you want.
          Don’t worry, it only takes a couple of minutes.
          <strong>Please consider that it’s not possible to complete the task without the training passed.</strong>
        `, () => {
          $('.tutorial-modal').modal('show');
          this.annot.reminder = setTimeout(reminder, 30 * 60 * 1000);
        });
      }
    }

    this.annot.percentageUpdated.subscribe(
      (p) => {
        this.percentage = p;
      },
      error => console.error(error)
    );
  }

  testPassed() {
    const sum = (array) => {
      let sum = 0;
      for (const i of array) {
        sum += i;
      }
      return sum;
    };

    if (sum(this.common.user.tutorials[this.common.tutorial]) === 0) {
      return false;
    }

    return true;
  }

  prevHint() {
    if (this.annot.demoHint > 0) {
      this.annot.demoHint--;
    }
  }

  nextHint() {
    if (this.annot.demoHint === 0) {
      this.annot.demoHint = 1;
    } else if (this.annot.demoHint === 3) {
      this.annot.demoHint = 4;
    } else if (this.annot.demoHint === 12) {
      this.annot.demoHint = 13;
    } else if (this.annot.demoHint < this.annot.demoHints.length - 1) {
      this.annot.demoHint++;
    }
  }
}
