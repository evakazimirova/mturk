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

  constructor(private common: CommonService, private vp: VideoPlayerService) { }

  ngOnInit() {}

  // 19. Сохранение в режиме разметки на фрагменты, приводит к созданию файла с именем включающем название видео файла и ID аннотатора.
  saveMarkup() {
    for (let i in this.common.task.events) {
      // заголовок для выходного CSV
      let outputCSV = 'ID,start,end\n';

      // преобразуем данные в CSV
      outputCSV += this.vp.fragments[i].map(function(d){
        return d.join();
      }).join('\n');

      let filename = `${this.video}_${this.common.user.id}_task_${i + 1}.mp4`;
      console.log(filename, outputCSV);
    }
  }

  selectFragment(fragment) {
    // console.log("Выбран фрагмент: ", this.vp.fragments[fragment]);
    this.vp.cf = fragment;
    this.vp.startFragment = this.vp.fragments[fragment][1];
    this.vp.endFragment = this.vp.fragments[fragment][2];
    this.vp.selectFragment();
  }
}
