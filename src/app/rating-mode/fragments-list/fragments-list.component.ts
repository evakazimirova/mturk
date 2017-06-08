import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-fragments-list',
  templateUrl: './fragments-list.component.html',
  styleUrls: ['./fragments-list.component.scss']
})
export class FragmentsListComponent implements OnInit {

  constructor(private common: CommonService, private http: HttpService) {}

  ngOnInit() {
  }


  saveRating() {
    // 11. При нажатии клавиши сохранить происходит проверка, все ли фрагменты видео оценены во всех доступных шкалах. Если нет, то необходимо перейти к первому неоцененному фрагменту.
    let totalEmotions = this.common.task.emotions.length;
    let totalFragments =  this.common.csv.length;
    let isBroken = false;

    // перебираем все эмоции
    for (let i = 0; i < totalEmotions; i++) {
      if (isBroken) {
        break;
      }

      for (let j = 0; j < totalFragments; j++) {
        if (this.common.rating[i][j] === -1) {
          alert(`Фрагмент ${j + 1} в шкале "${this.common.task.emotions[i].title}" не оценён. Пожалуйста, оцените все фрагменты перед сохранением.`);

          // переходим к неоцененному фрагменту
          this.common.emotion = i;
          this.common.cf = j;

          isBroken = true;
          break;
        }
      }
    }

    if (!isBroken) {
      // 12. Выставленные оценки для всех шкал сохраняются на сервере по уникальным для каждого пользователя именем в формате csv или xls/xlsx, в столбцах: Номер фрагмента/Начало фрагмента/Конец фрагмента/Оценка по шкале 1/Оценка по шкале 2/и. т. д.
      let ratedCSV = JSON.parse(JSON.stringify(this.common.csv));
      // ratedCSV = ratedCSV.concat();
      //  = this.common.csv.slice(0); // клонируем массив (а не ссылку)

      for (let i = 0; i < totalFragments; i++) {
        // ratedCSV.push(this.common.csv[i]);

        for (let j = 0; j < totalEmotions; j++) {
          ratedCSV[i].push(this.common.rating[j][i]);
        }
      }

      // заголовок для выходного CSV
      let outputCSV = 'Start,End';
      for (let emotion of this.common.task.emotions) {
        outputCSV += `,Em${emotion.EID}`
      }
      outputCSV += "\n";

      // преобразуем данные в CSV
      outputCSV += ratedCSV.map(function(d){
        return d.join();
      }).join('\n');

      // разрешаем переходить к другому видео или закрывать сайт
      this.common.allFragmentsRated = true;


      // считаем, сколько эмоций проработано
      const emotionsCount = this.common.task.emotions.length;

      const output = {
        result: outputCSV,
        ATID: this.common.task.ATID,
        done: emotionsCount
      };

      // сохраняем резульат
      this.http.post(output, 'AnnotatorTasksMarkUP/updateResult').subscribe(
        (res) => {
          // обновляем баланс пользователя
          this.common.user.money.available = res.money;
          // и рейтинг
          this.common.user.rating = res.rating;

          // возвращаемся в личный кабинет
          this.common.mode = 'profile';
        },
        err => console.log(err)
      );
    }
  }
}
