import { CommonService } from '../common.service';
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

  constructor(private http: HttpService, private common: CommonService) { }

  ngOnInit() {
    // читаем файл конфигурации
    this.http.get('./assets/conf.json').subscribe(
      (conf) => {
        this.common.conf = conf;

        // 2. Web-интерфейс отображает список видеозаписей доступных для разметки.
        this.videos = conf.videos;
        this.pathToData = conf.pathToData;

        // загружаем первое видео
        this.common.setVideo(this.pathToData + this.videos[0]);
      },
      (error) => console.log(error)
    );
  }
}
