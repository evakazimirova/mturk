import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
  form: FormGroup;

  // индикатор загрузки
  isRequesting = false;

  constructor(public common: CommonService,
              private http: HttpService,
              private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'money': ['', [
        Validators.required,
        Validators.pattern('[0-9]{1,4}')
      ]],
      'account': ['', [
        Validators.required,
        Validators.pattern('.{8,}')
      ]]
    });
  }

  sendRequest(event) {
    event.preventDefault(); // отменяем стандартное действие

    if (!this.isRequesting && this.form.valid) {
      // запрашивае только если хватает денег
      if (this.form.value.money <= this.common.user.money.available) {
        // формируем запрос
        const request = {
          money: this.form.value.money,
          system: this.paymentSystem,
          account: this.form.value.account
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
        this.common.alert('You haven\'t earned this amount of money yet. Please, work harder!');
        this.form.value.money = this.common.user.money.available;
      }
    }
  }
}
