import { CommonService } from './../common.service';
import { HttpService } from './../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-rating-mode',
  templateUrl: './rating-mode.component.html',
  styleUrls: ['./rating-mode.component.scss']
})
export class RatingModeComponent implements OnInit {

  constructor(private http: HttpService, private common: CommonService) {}

  ngOnInit() {
    // 2. Web-интерфейс отображает список видеозаписей доступных для разметки.
    // 4. Выбор шкалы осуществляется пользователем из некоторого заранее заданного файла.
    // загружаем первое видео
    this.common.cv = this.common.cv;
    this.common.setVideo(this.common.conf.pathToData + this.common.cv);
  }

  return() {
    this.common.mode = 'profile';
  }
}
