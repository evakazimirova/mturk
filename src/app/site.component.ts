import { CommonService } from './common.service';
import { HttpService } from './http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-app',
  templateUrl: './site.component.html'
})
export class SiteComponent implements OnInit {
  constructor(
    private common: CommonService,
    private http: HttpService
  ) {}

  ngOnInit() {
    // определяем, какую страницу показывать при заходе на сайт
    this.http.get('/annotators/authorized').subscribe(
      user => {
        // авторизован ли пользователь
        if (user) {
          // меняет ли пользователь пароль
          if (user.chPass) {
            this.common.mode = 'changePassword';
          } else {
            this.common.mode = 'profile';
            this.common.user = user;
          }
        } else {
          this.common.mode = 'auth';
        }
      },
      error => console.error(error)
    );
  }
}
