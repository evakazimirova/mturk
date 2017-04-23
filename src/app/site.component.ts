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
    this.http.get('./assets/conf.json').subscribe(
      conf => {
        this.common.conf = conf
        this.common.mode = "fragmentsRating"; // fragmentsRating | fragmentsMarking
      },
      error => console.log(error)
    );
  }
}