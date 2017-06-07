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
        console.log(video);
        // меняем источник видео
        this.currentVideo = video;
        this.common.videoContainer.load();

        this.common.videoContainer.addEventListener('loadeddata', () => {
          this.common.videoLength = this.common.videoContainer.duration;

          if (this.common.mode === "fragmentsRating") {
            this.common.setFragment(-1); // запускаем видео целиком
          }

          if (this.common.mode === "fragmentsMarking") {
            this.common.unwatchVideo('stop');
          }
        }, false);

        // // 5. По умолчанию воспроизведение начинается с 0-го фрагмента.
        // this.common.videoContainer.currentTime = this.common.csv[this.common.cf][1];

        // ДОП 1. сделать возможность просматривать весь видеофайл (это необходимо сделать аннотаторам перед разметкой каждого видео, по умолчанию выбор нового видео должен приводить к тому что включается воспроизведение видео без фрагментов). То есть должна быть кнопка в управлении, которая запускает видео таймлайн при этом это длина всего файла. Когда такой тип воспроизведения активен, соответствующая кнопка подсвечивается, чтобы перейти к разметке надо ее отжать, либо выбрать фрагмент.
        this.common.videoContainer.currentTime = 0;
        // this.common.updateCSV();
      },
      (error) => console.log(error)
    );
  }

}
