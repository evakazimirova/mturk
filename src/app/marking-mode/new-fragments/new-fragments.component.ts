import { HttpService } from '../../http.service';
import { VideoPlayerService } from '../video-player.service';
import { CommonService } from '../../common.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'na-new-fragments',
  templateUrl: './new-fragments.component.html',
  styleUrls: ['./new-fragments.component.scss']
})
export class NewFragmentsComponent implements OnInit {
  @Input() video;
  fragments = this.vp.fragments;

  constructor(private common: CommonService, private vp: VideoPlayerService, private http: HttpService) { }

  ngOnInit() {}

  // 19. Сохранение в режиме разметки на фрагменты, приводит к созданию файла с именем включающем название видео файла и ID аннотатора.
  saveMarkup() {
    let results = [];
    for (let i in this.common.task.tasks) {
      // заголовок для выходного CSV
      let outputCSV = 'start,end\n';

      // преобразуем данные в CSV
      outputCSV += this.vp.fragments[i].map(function(d){
        return d.join();
      }).join('\n');

      results.push({
        event: this.common.task.tasks[i].EID,
        fragments: outputCSV
      });
    }


    // // разрешаем переходить к другому видео или закрывать сайт
    // this.common.allFragmentsRated = true;


    // считаем, сколько эмоций проработано
    const eventsCount = this.common.task.tasks.length;

    const output = {
      result: results,
      ATID: this.common.task.ATID,
      done: eventsCount
    };

    // сохраняем резульат
    this.http.post(output, 'AnnoTasks/save').subscribe(
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

  selectFragment(fragment) {
    // console.log("Выбран фрагмент: ", this.vp.fragments[fragment]);
    this.vp.cf = fragment;
    this.vp.startFragment = this.vp.fragments[fragment][1];
    this.vp.endFragment = this.vp.fragments[fragment][2];
    this.vp.selectFragment();
  }
}
