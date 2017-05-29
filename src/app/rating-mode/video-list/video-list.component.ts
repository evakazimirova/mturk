import { CommonService } from '../../common.service';
import { HttpService } from '../../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  constructor(private http: HttpService, private common: CommonService) { }

  ngOnInit() {
    // Предотвратить закрытие страницы
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      if(this.common.allFragmentsRated) {
        return null;
      } else {
        return "Работа не окончена. Вы уверены, что хотите закрыть страницу?";
      }
    }
  }

  setVideo(video) {
    this.common.cv = video;
    this.common.setVideo(this.common.conf.pathToData + video);
  }
}
