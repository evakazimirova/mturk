import { CommonService } from './common.service';
import { HttpService } from './http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-app',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

  constructor(private http: HttpService, private common: CommonService) {}

  ngOnInit() {
    // 1. интерфейс авторизации (имя + id)
    if(this.common.mode === "fragmentsRating") {
      this.http.get("../data/users.json").subscribe(
        (users) => {
          let answer: any;
          while (true) {
            answer = prompt("Как вас зовут?");

            if (answer !== null) {
              if (answer.length > 0) {
                this.common.user.name = answer;
                this.common.user.id = users.length; // нужна БД
                console.log(this.common.user);
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



/*

Вопросы по ТЗ:

1. Нужен ли интерфейс авторизации? По идее пользователи просто входят на страницу и Турок про них уже всё знает. Нужно только считать информацию.

2. В каком виде лучше хранить список видеозаписей? Генерируется сам по наличию записей или задаётся вручную (так можно задавать, что будет доступно, а что нет)?

4. Что значит "Выбор шкалы осуществляется пользователем из некоторого заранее заданного файла."?



Требования ТЗ:




15. Созданные фрагменты отображаются в таблице «список фрагментов»

16. В режиме разметки на фрагменты появляется выбор скорости скролла по таймлайну, нажатием на клавиши «влево» и «вправо» - 1 сек, 0,5 сек, 0,1 сек. Выбор вместо кнопок выставления оценки.

17. Также в интерфейсе продублированы кнопки «начало фрагмента» «конец фрагмента»

18. Нажатие стрелки «вверх» на клавиатуре создает начало фрагмента, «вниз» конец фрагмента.

19. Сохранение в режиме разметки на фрагменты, приводит к созданию файла с именем включающем название видео файла и ID аннотатора.


воспроизводить фрагменты видеофайла заданной длины

размечать видеофайл на фрагменты, и экспортировать разметку
*/