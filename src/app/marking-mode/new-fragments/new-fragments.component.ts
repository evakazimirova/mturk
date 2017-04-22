import { VideoPlayerService } from '../video-player.service';
import { CommonService } from '../../common.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'na-new-fragments',
  templateUrl: './new-fragments.component.html',
  styleUrls: ['./new-fragments.component.scss'],
  providers: [ VideoPlayerService ]
})
export class NewFragmentsComponent implements OnInit {
  @Input() video;

  constructor(private common: CommonService, private vp: VideoPlayerService) { }

  ngOnInit() {}

  // 19. Сохранение в режиме разметки на фрагменты, приводит к созданию файла с именем включающем название видео файла и ID аннотатора.
  saveMarkup() {
    console.log("Сохранение разметки");

    // заголовок для выходного CSV
    let outputCSV = 'ID,start,end\n';

    // преобразуем данные в CSV
    outputCSV += this.vp.fragments.map(function(d){
      return d.join();
    }).join('\n');

    let filename = `${this.video}_${this.common.user.id}.mp4`;
    console.log(filename, outputCSV);
  }
}
