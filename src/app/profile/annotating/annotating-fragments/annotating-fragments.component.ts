import { Component } from '@angular/core';
import { HttpService } from '../../../http.service';
import { CommonService } from '../../../common.service';
import { AnnotatingService } from '../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-fragments',
  templateUrl: './annotating-fragments.component.html'
})
export class AnnotatingFragmentsComponent {
  // индикатор загрузки
  loading = false;

  // размеры массивов с данными
  totalEmotions = this.annot.task.FIDs[this.annot.FID].emotions.length;
  totalFragments = this.annot.csv.length;

  constructor(private common: CommonService,
              private http: HttpService,
              public annot: AnnotatingService) {}

  // сохраняем данные на сервере
  saveRating() {
    this.totalFragments = this.annot.csv.length;
    const isUnrated = this.checkIfUnrated();

    if (!isUnrated) {
      // обнуляем те эмоции, по которым не кликали
      for (let i = 0; i < this.totalEmotions; i++) {
        for (let j = 0; j < this.totalFragments; j++) {
          if (this.annot.rating[i][j] === -1) {
            this.annot.rating[i][j] = 0;
          }
        }
      }

      // добавляем результаты аннотирования к фрагментам
      const ratedCSV = JSON.parse(JSON.stringify(this.annot.csv)); // клонируем массив, а не ссылку на него
      for (let i = 0; i < this.totalFragments; i++) {
        for (let j = 0; j < this.totalEmotions; j++) {
          ratedCSV[i].push(this.annot.rating[j][i]);
        }
      }

      // заголовок для выходного CSV
      let outputCSV = 'Start,End';
      for (const emotion of this.annot.task.FIDs[this.annot.FID].emotions) {
        outputCSV += `,E${emotion}`;
      }
      outputCSV += '\n';

      // преобразуем данные в CSV
      outputCSV += ratedCSV.map(function(d){
        return d.join();
      }).join('\n');

      // переводим разметку в нужный формат
      const FID = this.annot.FID;
      this.annot.fragmentsWip[FID] = {
        FID: this.annot.task.FIDs[FID].FID,
        csv: outputCSV
      };

      this.annot.task.FIDs[FID].done = true;
      let tasksDone = 0;
      for (const fid of this.annot.task.FIDs) {
        if (fid.done) {
          tasksDone++;
        }
      }

      // формируем данные для запроса на сервер
      const output = {
        result: this.annot.fragmentsWip,
        ATID: this.annot.task.ATID,
        done: tasksDone,
        total: this.annot.task.FIDs.length // общее число задач
      };

      this.annot.updatePercentage(tasksDone);

      // сохраняем резульат в БД
      this.loading = true;
      this.http.post(output, 'AnnoTasks/save').subscribe(
        res => {
          this.loading = false;

          // обновляем баланс пользователя и рейтинг
          this.common.user.money.available = res.money;
          this.common.user.rating = res.rating;

          // разрешаем переходить к другому видео или закрывать сайт
          this.annot.allFragmentsRated = true;

          // если закончили разметку, возвращаемся на главную
          if (output.total === output.done) {
            if (!res.taskTaken) {
              this.common.user.taskTaken = null;
              for (let project of this.common.projects) {
                project.annoTask = undefined;
              }

              // обновляем уровень
              if (this.common.user.level < res.level) {
                this.common.user.level = res.level;
                this.common.alert(`Congratulations! You have unlocked level ${res.level}!`);
              };
            }
            this.common.profileMode = 'taskList';

            // чистим кэш
            this.annot.rating = [[]];
            this.annot.fragmentsWip = [];
            this.annot.cf = -1;
            this.annot.emotion = 0;
          } else {
            // если не закончили, то переходим к следующему видео
            this.annot.FID++;
            this.annot.setVideo();
          }
        },
        err => {
          this.loading = false;
          console.error(err);
        }
      );
    }
  }

  // проверка, все ли фрагменты видео оценены во всех доступных шкалах
  checkIfUnrated() {
    let isUnrated = false;

    // проверяем
    for (let i = 0; i < this.totalFragments; i++) {
      // уже нашли неоценнённый фрагмент
      if (isUnrated) {
        break;
      }

      if (!this.annot.rated[i]) {
        // не все => переходим к неоцененному фрагменту
        this.annot.cf = i;

        // сообщаем о находке
        this.common.alert(`Фрагмент ${i + 1} не оценён. Пожалуйста, оцените все фрагменты перед сохранением.`);

        // не даём сохраняться
        isUnrated = true;
        break;
      }
    }

    return isUnrated;
  }
}
