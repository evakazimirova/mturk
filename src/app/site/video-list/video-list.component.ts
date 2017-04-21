import { PushService } from '../push.service';
import { HttpService } from '../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  videos: string[];
  pathToData: string;

  constructor(private http: HttpService, private push: PushService) { }

  ngOnInit() {
    // читаем файл конфигурации
    this.http.get('./assets/conf.json').subscribe(
      (conf) => {
        this.push.conf = conf;

        // 2. Web-интерфейс отображает список видеозаписей доступных для разметки.
        this.videos = conf.videos;
        this.pathToData = conf.pathToData;

        // загружаем первое видео
        this.push.setVideo(this.pathToData + this.videos[0]);
      },
      (error) => console.log(error)
    );
  }
}
