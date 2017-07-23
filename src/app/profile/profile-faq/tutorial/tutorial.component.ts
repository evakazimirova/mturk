import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
  tutorialVideo: any;

  tutorial = {
    video: 157
  };

  constructor() { }

  ngOnInit() {
    this.tutorialVideo = document.getElementById('tutorialVideo');
  }

  playVideo() {
    if (this.tutorialVideo.paused) {
      this.tutorialVideo.currentTime = 0;
      this.tutorialVideo.play();
    } else {
      this.tutorialVideo.pause();
    }
  }
}
