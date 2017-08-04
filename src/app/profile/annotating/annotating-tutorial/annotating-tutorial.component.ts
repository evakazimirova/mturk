import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
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

  emotion = 0;
  example = 0;
  more = 0;
  test = 0;
  progress = 0;
  progressPercentage = 0;
  progressTotal = 0;
  manual = true;

  constructor(private http: HttpService,
              private annot: AnnotatingService) { }

  ngOnInit() {
    this.http.get('assets/tutorials.json').subscribe(
      tutorials => {
        this.loading = false;

        this.tutorials = tutorials;
        this.tutorial = this.tutorials[this.annot.tutorial];

        this.progressTotal = 5 + this.tutorial.emotions.length + this.tutorial.tests.length;
      },
      error => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  playVideo(event) {
    if (this.tutorialVideo.paused) {
      this.tutorialVideo.play();
    } else {
      this.tutorialVideo.pause();
      this.tutorialVideo.currentTime = 0;
    }
  }

  nextScreen() {
    if (this.screen === 3) {
      this.more = 0;
      if (this.emotion < this.tutorial.emotions.length - 1) {
        if (this.tutorial.emotions[this.emotion].examples) {
          if (this.example < this.tutorial.emotions[this.emotion].examples.length) {
            this.example++;
            this.tutorialVideo = document.getElementById('tutorialVideo');
            this.tutorialVideo.load();
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
    } else if (this.screen === 5) {
      if (this.test < this.tutorial.tests.length - 1) {
        this.test++;
      } else {
        // this.progress = this.progressTotal;
        this.progress = 0;

        // выходим из туториала
        this.screen = 0;
        $('.tutorial-modal').modal('hide');
      }
    } else {
      this.screen++;
    }

    this.progress++;
    this.progressPercentage = +(this.progress / this.progressTotal * 100).toFixed(0);
  }
}
