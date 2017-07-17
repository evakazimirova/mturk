import { Component } from '@angular/core';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { AnnotatingService } from '../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-fragments',
  templateUrl: './annotating-fragments.component.html'
})
export class AnnotatingFragmentsComponent {
  // индикатор загрузки
  loading = false;

  // размеры массивов с данными
  totalEmotions = this.annot.task.emotions.length;
  totalFragments = this.annot.csv.length;

  constructor(private common: CommonService,
              private http: HttpService,
              public annot: AnnotatingService) {}

  // сохраняем данные на сервере
  saveRating() {
    const isUnrated = this.checkIfUnrated();

    if (!isUnrated) {
      // добавляем результаты аннотирования к фрагментам
      const ratedCSV = JSON.parse(JSON.stringify(this.annot.csv)); // клонируем массив, а не ссылку на него
      for (let i = 0; i < this.totalFragments; i++) {
        for (let j = 0; j < this.totalEmotions; j++) {
          ratedCSV[i].push(this.annot.rating[j][i]);
        }
      }

      // заголовок для выходного CSV
      let outputCSV = 'Start,End';
      for (const emotion of this.annot.task.emotions) {
        outputCSV += `,E${emotion.EID}`;
      }
      outputCSV += '\n';

      // преобразуем данные в CSV
      outputCSV += ratedCSV.map(function(d){
        return d.join();
      }).join('\n');

      // переводим разметку в нужный формат
      const FID = this.annot.task.fragments[this.annot.task.currentFragment].FID;
      this.annot.fragmentsWip[FID] = outputCSV;

      // формируем данные для запроса на сервер
      const output = {
        result: this.annot.fragmentsWip,
        ATID: this.annot.task.ATID,
        done: this.annot.task.emotions.length // число проработанных эмоций
      };

      // сохраняем резульат в БД
      this.loading = true;
      this.http.post(output, 'AnnoTasks/save').subscribe(
        res => {
          this.loading = false;

          // обновляем баланс пользователя и рейтинг
          this.common.user.money.available = res.money;
          this.common.user.rating = res.rating;
        },
        err => {
          this.loading = false;
          console.error(err);
        }
      );

      // разрешаем переходить к другому видео или закрывать сайт
      this.annot.allFragmentsRated = true;
    }
  }

  // проверка, все ли фрагменты видео оценены во всех доступных шкалах
  checkIfUnrated() {
    let isUnrated = false;
    for (let i = 0; i < this.totalEmotions; i++) {
      // уже нашли неоценнённый фрагмент
      if (isUnrated) {
        break;
      }

      // проверяем
      for (let j = 0; j < this.totalFragments; j++) {
        if (this.annot.rating[i][j] === -1) {
          // не все => переходим к неоцененному фрагменту
          this.annot.emotion = i;
          this.annot.cf = j;

          // сообщаем о находке и не даём сохраняться
          alert(`Фрагмент ${j + 1} в шкале "${this.annot.task.emotions[i].title}" не оценён. Пожалуйста, оцените все фрагменты перед сохранением.`);
          isUnrated = true;
          break;
        }
      }
    }

    return isUnrated;
  }
}
