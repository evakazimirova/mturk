import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { AnnotatingService } from '../annotating/annotating.service';

@Component({
  selector: 'na-profile-tutorial',
  templateUrl: './profile-tutorial.component.html',
  styleUrls: ['./profile-tutorial.component.scss']
})
export class ProfileTutorialComponent implements OnInit {
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
    $(document).ready(() => {
      $('.tutorial-modal').on('hidden.bs.modal', (e) => {
        this.common.tutorial = undefined;
      })
    });

    this.http.get('assets/tutorials.json').subscribe(
      tutorials => {
        this.loading = false;

        this.tutorials = tutorials;
        this.tutorial = this.tutorials[this.common.tutorial];

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

        this.progressTotal = 3 + this.tutorial.emotions.length + this.tutorial.tests.length;
        for (let e of this.tutorial.emotions) {
          if (e.examples) {
            this.progressTotal += e.examples.length;
          }
        }
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
        const newTest = this.test + 1;
        this.test = undefined;
        setTimeout(() => {
          this.test = newTest;
          this.initDragAndDrop();
        }, 100);
      } else {
        this.progress = 0;
        // this.progress = this.progressTotal;

        // выходим из туториала
        $('.tutorial-modal').modal('hide');
        this.screen = 1;
      }
    } else {
      this.screen++;
    }

    console.log(this.test, this.screen);

    this.progress++;
    this.progressPercentage = +(this.progress / this.progressTotal * 100).toFixed(0);
  }

  initDragAndDrop() {
      $(document).ready(() => {
        const answers = $(".answer");
        const slots = $(".slot");
        const numOfSlots = slots.length;
        let guessed = 0;
        let mistake = 0;
        console.log(slots);

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
                this.common.user.tutorials[this.common.tutorial][this.test] = mistake + 1;
                this.http.post({tutorials: this.common.user.tutorials}, 'AnnotatorInfo/saveTutorial').subscribe(
                  () => {},
                  error => console.error(error)
                );

                this.common.tutorialDone;
                // переходим к следующему тесту
                mistake = 0;
                this.nextScreen();
              }
            } else {
              // неверно
              answer.animate({
                top: 0,
                left: 0
              });

              mistake++;
              if (mistake < 2) {
                this.common.alert(`Sorry but you are wrong. Please try again.`);
              } else {
                slots.each((i) => {
                  $(slots[i])
                    .removeClass('empty')
                    .removeClass('slot')
                    .addClass('answer')
                    .text($(slots[i]).data().label)
                    .css({opacity: 0})
                    .animate({opacity: 1});
                });
                answers.animate({opacity: 0});

                const nextScreen = () => {
                  answers.css({opacity: 1});
                  console.log(this.test);
                  this.nextScreen();
                  console.log(this.test);
                };
                setTimeout(nextScreen, 3000);
              }
            }
          }
        });
      });
  }
}
