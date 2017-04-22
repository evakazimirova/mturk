import { CommonService } from '../common.service';
import { HttpService } from '../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  constructor(private http: HttpService, private common: CommonService) { }

  ngOnInit() {
    // читаем файл конфигурации
    this.http.get('./assets/conf.json').subscribe(
      (conf) => {
        // 2. Web-интерфейс отображает список видеозаписей доступных для разметки.
        // 4. Выбор шкалы осуществляется пользователем из некоторого заранее заданного файла.
        this.common.conf = conf;

        // загружаем первое видео
        this.common.setVideo(conf.pathToData + conf.videos[0]);
      },
      (error) => console.log(error)
    );
  }
}
