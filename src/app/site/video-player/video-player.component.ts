import { HttpService } from '../http.service';
import { PushService } from '../push.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'na-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  pathToData: string;
  currentVideo: string;
  videoContainer;

  constructor(private push: PushService, private http: HttpService) { }

  ngOnInit() {
    // читаем файл конфигурации
    // this.http.get('./assets/conf.json').subscribe(
    //   (conf) => {
    //     this.pathToData = conf.pathToData;
    //   },
    //   (error) => console.log(error)
    // );

    this.videoContainer = document.getElementById('currentVideo');

    // 7. Оценка фрагменту выставляется с помощью кнопок в web-интерфейсе или по нажатию клавиш 1 2 3 4 5.
    $(document).keypress((e) => {
      if (e.keyCode >= 49 && e.keyCode <= 53) {
        this.push.saveThisMark(e.key);
      }
    });

    // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем видеозаписи
    this.push.currentVideo.subscribe(
      (video) => {
        this.currentVideo = video + ".mp4";
        this.videoContainer.load();
      },
      (error) => console.log(error)
    );
  }
}
