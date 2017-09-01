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
  test = undefined;
  testExists = false;
  progress = 0;
  progressPercentage = 0;
  progressTotal = 0;
  manual = true;
  stateHistory: any = [];
  justTest = false;
  videoPaused = [true, true, true, true, true, true];
  videoSources = [];

  constructor(private http: HttpService,
              private common: CommonService,
              private annot: AnnotatingService) { }

  ngOnInit() {
    $(document).ready(() => {
      this.common.tutorialModal = $('.tutorial-modal');
      this.common.tutorialModal
        .on('shown.bs.modal', (e) => {
          this.updateTutorial();
          this.common.isInTutorial = true;

          // ставим видео на паузу
          if (this.common.profileMode === 'annotating') {
            this.annot.unwatchVideo('pause');
          }
        })
        .on('hidden.bs.modal', (e) => {
          this.finishTutorial(false);
        });
    });

    $(document).keyup((e) => {
      if (this.common.isInTutorial) {
        if (e.keyCode === 37) { // стрелка влево
          if (this.screen !== 1 && !this.justTest) {
            this.previousScreen();
          }
        } else if (e.keyCode === 39) { // стрелка вправо
          if (this.screen !== 5) {
            this.nextScreen();
          }
        }
      }
    });

    this.http.get('assets/tutorials.json').subscribe(
      tutorials => {
        this.loading = false;
        this.tutorials = tutorials;
        this.updateTutorial();
      },
      error => {
        this.loading = false;
        console.error(error);
      }
    );

    this.common.testStarted.subscribe(
      testIndex => {
        this.screen = 5;
        this.test = testIndex;
        this.justTest = true;
        this.initDragAndDrop();
      },
      error => console.error(error)
    );
  }

  updateTutorial() {
    this.tutorial = this.tutorials[this.common.tutorial];

    this.labels = [];
    const tests = [];
    for (const test of this.tutorial.tests) {
      const labels = [];
      for (const v of test) {
        labels.push(v.label);
      }
      this.labels.push(labels);
      tests.push(_.shuffle(test));
    }
    this.tutorial.tests = tests;

    this.progressTotal = 3 + this.tutorial.emotions.length;
    for (const e of this.tutorial.emotions) {
      if (e.examples) {
        this.progressTotal += e.examples.length;
      }
    }

    for (const t in this.common.user.tutorials[this.common.tutorial]) {
      if (this.common.user.tutorials[this.common.tutorial][t] === 0) {
        this.test = +t;
        this.testExists = true;
        break;
      }
    }
  }

  finishTutorial(hideModal = true) {
    // очищаем кэш
    this.screen = 1;
    this.emotion = 0;
    this.example = 0;
    this.more = 0;
    this.test = undefined;
    this.testExists = false;
    this.progress = 0;
    this.progressPercentage = 0;
    this.progressTotal = 0;

    this.stateHistory = [];
    this.common.isInTutorial = false;
    this.justTest = false;

    // сворачиваем окно
    if (hideModal) {
      this.common.tutorialModal.modal('hide');
    }
  }

  playVideo(event, video) {
    let videoContainer;
    if ($(event.target).hasClass('tutorialVideo')) {
      videoContainer = event.target;
    } else {
      videoContainer = event.path[2].children['tutorialVideo'];
    }

    const $videoContainer = $(videoContainer);
    const videoSource = $videoContainer.find('source');

    this.videoSources.push(videoSource);

    if (videoSource.attr('src') === '') {
      videoSource.attr('src', `https://storage.googleapis.com/video_tutorial/(${video}).mp4`);
      videoContainer.load();

      $videoContainer.on("loadstart", () => {
        $videoContainer.off("loadstart");
        videoContainer.play();
        this.videoPaused[0] = false;
      });
    } else {
      if (videoContainer.paused) {
        videoContainer.play();
        this.videoPaused[0] = false;
      } else {
        videoContainer.pause();
        videoContainer.currentTime = 0;
        this.videoPaused[0] = true;
      }
    }
  }

  nextScreen() {
    this.videoPaused = [true, true, true, true, true, true];
    if (this.tutorialVideo) {
      if (!this.tutorialVideo.paused) {
        this.tutorialVideo.pause();
      }
    }

    // for (let videoSource of this.videoSources) {
    //   videoSource.attr('src', '');
    // }
    // this.videoSources = [];

    this.stateHistory.push({
      screen: this.screen,
      example: this.example,
      emotion: this.emotion,
      progress: this.progress,
      progressPercentage: this.progressPercentage
    });

    if (this.screen === 3) {
      this.more = 0;
      if (this.emotion < this.tutorial.emotions.length) {
        if (this.tutorial.emotions[this.emotion].examples) {
          if (this.example < this.tutorial.emotions[this.emotion].examples.length) {
            this.example++;
            $(document).ready(() => {
              this.tutorialVideo = document.getElementById('tutorialVideo');
              const videoSource = $(this.tutorialVideo).find('source');
              videoSource.attr('src', '');
              this.tutorialVideo.load();
            });
          } else {
            this.example = 0;
            if (this.emotion < this.tutorial.emotions.length - 1) {
              this.emotion++;
            } else {
              this.emotion = 0;
              this.screen++;
            }
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

      if (this.testExists) {
        this.screen++;
        this.initDragAndDrop();
      } else {
        this.finishTutorial();
      }
    } else {
      this.screen++;
    }

    this.progress++;
    this.progressPercentage = +(this.progress / this.progressTotal * 100).toFixed(0);
  }

  previousScreen() {
    this.videoPaused = [true, true, true, true, true, true];

    const lastScreen = this.stateHistory.pop();

    this.screen = lastScreen.screen;
    this.example = lastScreen.example;
    this.emotion = lastScreen.emotion;
    this.progress = lastScreen.progress;
    this.progressPercentage = lastScreen.progressPercentage;

    if (this.screen === 3 && this.example > 0) {
      $(document).ready(() => {
        this.tutorialVideo = document.getElementById('tutorialVideo');
        const videoSource = $(this.tutorialVideo).find('source');
        videoSource.attr('src', '');
        this.tutorialVideo.load();
      });
    } else if (this.screen === 4) {
      this.more = 0;
    }
  }

  initDragAndDrop() {
    $(document).ready(() => {
      setTimeout(() => {
        for (const t in this.tutorial.tests[this.test]) {
          const tutorialVideo: any = document.getElementById('tutorialVideo_' + t);
          tutorialVideo.load();
        }

        const answers = $('.answer');
        const slots = $('.slot');
        const numOfSlots = slots.length;
        let guessed = 0;
        let mistake = 0;
        let isMistaken = false;
        let isPassedTest = false;

        answers.draggable({
          cursor: 'move',
          revert: 'invalid',
          cursorAt: {
            top: 28,
            left: 125
          }
        });

        slots.droppable({
          drop: (event, ui) => {
            const slot = $(event.target);
            const answer = ui.draggable;

            event.target.dataset.answer = ui.draggable.text();
            ui.draggable[0].dataset.slot = event.target.dataset.label;

            isPassedTest = true;
            for (const answer of answers) {
              if (!answer.dataset.slot) {
                isPassedTest = false;
              }
            }

            // for (const slot of slots) {
            //   console.log(slot.dataset.label, slot.dataset.answer);
            // }

            answer.animate({
              top: ui.position.top + (slot.offset().top - answer.offset().top),
              left: ui.position.left + (slot.offset().left - answer.offset().left)
            }, () => {
              if (isPassedTest) {
                isMistaken = false;
                for (const slot of slots) {
                  if (slot.dataset.label !== slot.dataset.answer) {
                    isMistaken = true;
                  }
                }

                if (!isMistaken) {
                  // // возвращаем все плашки на место
                  // answers.stop().css({
                  //   top: 0,
                  //   left: 0
                  // });

                  // запоминаем результат
                  this.common.user.tutorials[this.common.tutorial][this.test] = mistake + 1;
                  this.http.post({tutorials: this.common.user.tutorials}, 'AnnotatorInfo/saveTutorial').subscribe(
                    () => {
                      this.common.updateTutorials();
                    },
                    error => console.error(error)
                  );

                  this.common.tutorialDone = true;
                  // прекращаем напоминать о прохождении туториала
                  if (this.annot.reminder) {
                    clearInterval(this.annot.reminder);
                  }

                  // поздравляем аннотатора с успехом
                  this.common.alert(`Congrats! You've just passed one more test!`, () => {
                    this.finishTutorial();
                  });
                } else {
                  // неверно
                  answers.animate({
                    top: 0,
                    left: 0
                  });

                  mistake++;
                  if (mistake < 3) {
                    this.common.alert(`Sorry but you are wrong. Please try again.`);

                    for (const answer of answers) {
                      delete answer.dataset.slot;
                    }
                  } else {
                    this.common.alert(`Sorry but you are wrong again. You haven't passed the test. Here are the correct answer.`, () => {
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
                        this.finishTutorial();
                      };
                      setTimeout(nextScreen, 2000);
                    });
                  }
                }
              }
            });
          }
        });
      }, 100);
    });
  }
}
