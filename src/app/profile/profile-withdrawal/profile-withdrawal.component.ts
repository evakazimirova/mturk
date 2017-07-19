import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../common.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-profile-withdrawal',
  templateUrl: './profile-withdrawal.component.html',
  styleUrls: ['./profile-withdrawal.component.scss']
})
export class ProfileWithdrawalComponent {
  // данные по умолчанию
  paymentSystem = 'paypal';
  money = 0;
  account = '';

  // индикатор загрузки
  isRequesting = false;

  constructor(public common: CommonService,
              private http: HttpService) { }

  sendRequest() {
    if (!this.isRequesting) {
      // запрашивае только если хватает денег
      if (this.money <= this.common.user.money.available) {
        // формируем запрос
        const request = {
          money: this.money,
          system: this.paymentSystem,
          account: this.account
        };

        // отправляем запрос
        this.isRequesting = true;
        this.http.post(request, '/moneyRequests/send').subscribe(
          res => {
            this.isRequesting = false;

            // корректируем остаток
            this.common.user.money.available = res.available;
          },
          err => {
            this.isRequesting = false;
            console.error(err);
          }
        );
      } else {
        // сообщаем пользователю, что у него не так много денег для вывода
        alert('You haven\'t earned this amount of money yet. Please, work harder!');
        this.money = this.common.user.money.available;
      }
    }
  }
}
