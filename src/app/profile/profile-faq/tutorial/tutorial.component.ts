import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';

@Component({
  selector: 'na-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
  tutorialVideo: any;
  tutorials = [];
  screen = 1;
  emotion = 0;
  example = 0;
  more = 0;
  test = 0;
  manual = true;

  progress = 0;
  progressPercentage = 0;
  progressTotal = 0;

  tutorial: any = {};

  tuts = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    // this.tutorialVideo = document.getElementById('tutorialVideo');

    // this.http.get('extra/tutorialVideos').subscribe(
    //   tutorials => {
    //     this.tutorials = tutorials;
    //   },
    //   error => console.error(error)
    // );

    this.http.get('assets/tutorials.json').subscribe(
      tutorials => {
        this.tuts = tutorials;
        this.tutorial = this.tuts[0];
        this.progressTotal = 5 + this.tutorial.emotions.length + this.tutorial.tests.length;
      },
      error => console.error(error)
    );
  }

  playVideo() {
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
    this.progressPercentage = +(this.progress / this.progressTotal).toFixed(2) * 100;
  }
}
