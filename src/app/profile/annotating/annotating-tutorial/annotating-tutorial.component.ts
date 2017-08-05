import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { CommonService } from '../../../common.service';
import { AnnotatingService } from '../annotating.service';

@Component({
  selector: 'na-annotating-tutorial',
  templateUrl: './annotating-tutorial.component.html',
  styleUrls: ['./annotating-tutorial.component.scss']
})
export class AnnotatingTutorialComponent implements OnInit {
  loading = true;
  screen = 1;

  tutorials = [];
  tutorial: any = {};
  tutorialVideo: any;
  labels = [];

  emotion = 0;
  example = 0;
  more = 0;
  test = 0;
  progress = 0;
  progressPercentage = 0;
  progressTotal = 0;
  manual = true;

  constructor(private http: HttpService,
              private common: CommonService,
              private annot: AnnotatingService) { }

  ngOnInit() {
    this.http.get('assets/tutorials.json').subscribe(
      tutorials => {
        this.loading = false;

        this.tutorials = tutorials;
        this.tutorial = this.tutorials[this.annot.tutorial];

        this.labels = [];
        let tests = [];
        for (let test of this.tutorial.tests) {
          let labels = [];
          for (let v of test) {
            labels.push(v.label);
          }
          this.labels.push(labels);
          tests.push(_.shuffle(test));
        }
        this.tutorial.tests = tests;

        this.progressTotal = 5 + this.tutorial.emotions.length + this.tutorial.tests.length;
      },
      error => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  playVideo(event) {
    const tutorialVideo = event.target

    if (tutorialVideo.paused) {
      tutorialVideo.play();
    } else {
      tutorialVideo.pause();
      tutorialVideo.currentTime = 0;
    }
  }

  nextScreen() {
    if (this.screen === 3) {
      this.more = 0;
      if (this.emotion < this.tutorial.emotions.length - 1) {
        if (this.tutorial.emotions[this.emotion].examples) {
          if (this.example < this.tutorial.emotions[this.emotion].examples.length) {
            this.example++;
            $(document).ready(() => {
              this.tutorialVideo = document.getElementById('tutorialVideo');
              this.tutorialVideo.load();
            });
          } else {
            this.example = 0;
            this.emotion++;
          }
        } else {
          this.emotion++;
        }
      } else {
        this.emotion = 0;
        this.screen++;
      }
    } else if (this.screen === 4) {
      // инструкция к тесту (появляется только 1 раз)
      this.manual = false;
      this.screen++;
      this.initDragAndDrop();
    } else if (this.screen === 5) {
      if (this.test < this.tutorial.tests.length - 1) {
        this.test++;
        this.initDragAndDrop();
      } else {
        // this.progress = this.progressTotal;
        this.progress = 0;

        // выходим из туториала
        this.screen = 1;
        $('.tutorial-modal').modal('hide');
      }
    } else {
      this.screen++;
    }

    this.progress++;
    this.progressPercentage = +(this.progress / this.progressTotal * 100).toFixed(0);
  }

  initDragAndDrop() {
    $(document).ready(() => {
      const answers = $(".answer");
      const slots = $(".slot");
      const numOfSlots = slots.length;
      let guessed = 0;

      answers.draggable({
        cursor: "move",
        revert: "invalid",
        cursorAt: {
          top: 28,
          left: 125
        }
      });

      slots.droppable({
        drop: (event, ui) => {
          const slot = $(event.target);
          const answer = ui.draggable;

          if (event.target.dataset.label === ui.draggable.text()) {
            // верно
            answer.animate({
              top: ui.position.top + (slot.offset().top - answer.offset().top),
              left: ui.position.left + (slot.offset().left - answer.offset().left)
            })

            guessed++;
            if (guessed === numOfSlots) {
              // возвращаем все плашки на место
              answers.stop().css({
                top: 0,
                left: 0
              })

              // поздравляем аннотатора с успехом
              this.common.alert(`Congrats! You've just passed one more test!`);
              // запоминаем результат

              // переходим к следующему тесту
              this.nextScreen();
            }
          } else {
            // неверно
            answer.animate({
              top: 0,
              left: 0
            })

            this.common.alert(`Sorry but you are wrong. Please try again.`);
          }
        }
      });
    });
  }
}
