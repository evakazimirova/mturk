import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../common.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-profile-withdrawal',
  templateUrl: './profile-withdrawal.component.html',
  styleUrls: ['./profile-withdrawal.component.scss']
})
export class ProfileWithdrawalComponent implements OnInit {
  paymentSystem = 'paypal';
  money = 0;
  account = '';
  isRequesting = false;

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
  }

  sendRequest() {
    if (!this.isRequesting) {
      if (this.money <= this.common.user.money.available) {
        const request = {
          money: this.money,
          system: this.paymentSystem,
          account: this.account
        };

        this.isRequesting = true;
        this.http.post(request, '/moneyRequests/send').subscribe(
          res => {
            // console.log(res);
            this.common.user.money.available = res.available;
            this.isRequesting = false;
          },
          err => {
            console.log(err);
            this.isRequesting = false;
          }
        );
      } else {
        alert('You haven\'t earned this amount of money yet. Please, work harder!');
        this.money = this.common.user.money.available;
      }
    }
  }
}
