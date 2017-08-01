import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { CommonService } from '../../../common.service';

@Component({
  selector: 'na-profile-profile-english',
  templateUrl: './profile-profile-english.component.html',
  styleUrls: ['./profile-profile-english.component.scss']
})
export class ProfileProfileEnglishComponent implements OnInit {
  secondsLeft = 30;
  screen = 1;
  tests = [];
  answered = -1;
  rightTotal = 0;
  countingDown;
  testIndex = +(Math.random() * 2).toFixed(0);

  constructor(private common: CommonService,
              private http: HttpService) { }

  ngOnInit() {
    this.http.get('assets/englishTest.json').subscribe(
      tests => {
        this.tests = tests;
      },
      error => console.error(error)
    );
  }

  goToFaq() {
    this.common.profileMode = 'faq';
  }

  goToTasks() {
    this.common.profileMode = 'taskList';
  }

  nextPage() {
    this.screen++;

    if (this.screen === 5) {
      this.http.get(`annotatorInfo/passEnglishTest?rightTotal=${this.rightTotal}`).subscribe(
        info => {
          this.common.user.englishTest = info.englishTest;
        },
        error => console.error(error)
      );
    } else {
      this.secondsLeft = 30;

      $(document).ready(() => {
        var audio = document.getElementById("audioForTest");

        const countdown = () => {
          this.secondsLeft = this.secondsLeft - 1;
          if (this.secondsLeft === 0) {
            clearInterval(this.countingDown);
            this.countingDown = undefined;
            this.nextPage();
          }
        }

        audio.onplay = () => {
          if (!this.countingDown) {
            this.countingDown = setInterval(countdown, 1000);
          }
        };
      });
    }
  }

  chooseAnswer(i, right) {
    if (this.answered === -1) {
      this.answered = i;
      if (right) {
        this.rightTotal++;
      }

      const nextPage = () => {
        this.nextPage()
        this.answered = -1;

        if (this.countingDown) {
          clearInterval(this.countingDown);
          this.countingDown = undefined;
        }
      };

      setTimeout(nextPage, 1000);
    }
  }
}
