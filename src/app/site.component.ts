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
    // ДОП 2. в конфигурационном файле указывается список шкал для разметки и диапазон разметки. Диапазон может быть либо от 1 до 5 либо от -2 до +2.
    this.http.get('./assets/conf.json').subscribe(
      conf => {
        this.common.conf = conf
        this.common.mode = "auth"; // auth | fragmentsRating | fragmentsMarking
      },
      error => console.log(error)
    );
  }
}