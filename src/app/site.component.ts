import { CommonService } from './common.service';
import { HttpService } from './http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-app',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {
  constructor(
    public common: CommonService,
    private http: HttpService
  ) {}

  ngOnInit() {
    $(document).ready(() => {
      this.common.commonAlert = $('#commonAlert');
      this.common.commonConfirm = $('#commonConfirm');
    });

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

            if (this.common.user.firstTime) {
              this.common.alert('Welcome on Emotion miner! Now you can find out how it works! Just start Demo task, and get your first reward, it will take couple of minutes.');

              this.http.getRough('/annotators/firstTime').subscribe(
                ok => this.common.user.firstTime = false,
                error => console.error(error)
              );
            }
          }
        } else {
          this.common.mode = 'auth';
        }
      },
      error => console.error(error)
    );
  }
}
