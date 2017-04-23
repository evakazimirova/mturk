import { CommonService } from './common.service';
import { HttpService } from './http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-app',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

  constructor(private common: CommonService, private http: HttpService) {}

  ngOnInit() {
    // читаем файл конфигурации
    this.http.get('./assets/conf.json').subscribe(
      conf => {
        this.common.conf = conf
        this.common.mode = "fragmentsMarking"; // fragmentsRating | fragmentsMarking
      },
      error => console.log(error)
    );
  }
}



/*

Вопросы по ТЗ:

Где хранить файлы и куда записывать?

1. Нужен ли интерфейс авторизации? По идее пользователи просто входят на страницу и Турок про них уже всё знает. Нужно только считать информацию.

2. В каком виде лучше хранить список видеозаписей? Генерируется сам по наличию записей или задаётся вручную (так можно задавать, что будет доступно, а что нет)?

4. Что значит "Выбор шкалы осуществляется пользователем из некоторого заранее заданного файла."?

Пожалуй, в режиме разметки должно быть больше функционала.

*/