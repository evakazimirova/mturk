import { CommonService } from '../../common.service';
import { HttpService } from '../../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  constructor(private http: HttpService, private common: CommonService) { }

  ngOnInit() {
    // 2. Web-интерфейс отображает список видеозаписей доступных для разметки.
    // 4. Выбор шкалы осуществляется пользователем из некоторого заранее заданного файла.
    // загружаем первое видео
    this.common.setVideo(this.common.conf.pathToData + this.common.conf.videos[0]);

    // Предотвратить закрытие страницы
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      if(this.common.allFragmentsRated) {
        return null;
      } else {
        return "Работа не окончена. Вы уверены, что хотите закрыть страницу?";
      }
    }
  }
}
