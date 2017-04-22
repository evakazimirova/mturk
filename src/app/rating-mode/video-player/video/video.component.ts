import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  currentVideo: string;

  constructor(private common: CommonService) { }

  ngOnInit() {
    this.common.videoContainer = document.getElementById('currentVideo');

    // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем видеозаписи
    this.common.videoChanged.subscribe(
      (video) => {
        // меняем источник видео
        this.currentVideo = video + ".mp4";
        this.common.videoContainer.load();

        // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
        this.common.videoContainer.currentTime = this.common.csv[this.common.cf][1];
      },
      (error) => console.log(error)
    );
  }

}
