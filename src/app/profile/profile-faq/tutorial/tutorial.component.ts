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

  tutorial = {
    video: 157
  };

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.tutorialVideo = document.getElementById('tutorialVideo');

    this.http.get('extra/tutorialVideos').subscribe(
      tutorials => {
        this.tutorials = tutorials;
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
}
