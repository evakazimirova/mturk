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
    // 1. интерфейс авторизации (имя + id)
    if(this.common.user.name.length === 0) {
      this.http.get("../data/users.json").subscribe(
        (users) => {
          let answer: any;
          while (true) {
            answer = prompt("Как вас зовут?");

            if (answer !== null) {
              if (answer.length > 0) {
                this.common.user.name = answer;
                this.common.user.id = users.length; // нужна БД
                // console.log(this.common.user);

                // 2. Web-интерфейс отображает список видеозаписей доступных для разметки.
                // 4. Выбор шкалы осуществляется пользователем из некоторого заранее заданного файла.
                // загружаем первое видео
                this.common.cv = this.common.conf.videos[0];
                this.common.setVideo(this.common.conf.pathToData + this.common.conf.videos[0]);

                break; // перестаём спрашивать
              }
            }
          }
        },
        (error) => console.log(error)
      );
    }
  }

}
