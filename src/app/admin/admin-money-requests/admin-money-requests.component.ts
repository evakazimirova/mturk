import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-admin-money-requests',
  templateUrl: './admin-money-requests.component.html',
  styleUrls: ['./admin-money-requests.component.scss']
})
export class AdminMoneyRequestsComponent implements OnInit {
  // индикаторы загрузки
  isLoaded = false;
  isDefraing = false;

  requests = [];
  requestId = 0;
  requestDataFiller = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('/moneyRequests/getAll').subscribe(
      requests => {
        this.isLoaded = true;
        // обновляем список запросов
        this.requests = requests;

        // форма вывода информации по запосу
        this.requestDataFiller = [
          {
            title: 'Worker',
            value: this.requests[this.requestId].user.firstName + ' ' + this.requests[this.requestId].user.secondName
          },
          {
            title: 'E-mail',
            value: this.requests[this.requestId].user.email
          },
          {
            title: 'Phone',
            value: this.requests[this.requestId].user.phone
          },
          {
            title: 'Amount',
            value: this.requests[this.requestId].bill.amount
          },
          {
            title: 'Method',
            value: this.requests[this.requestId].bill.method
          },
          {
            title: 'Account',
            value: this.requests[this.requestId].bill.account
          }
        ];
      },
      err => {
        this.isLoaded = true;
        console.error(err);
      }
    );
  }

  // подтверждаем оплату
  defray() {
    if (!this.isDefraing) {
      // блокируем действия пользователя на время оплаты
      this.isDefraing = true;

      // текущее состояние запроса
      const cond = this.requests[this.requestId].bill.isDefrayed;
      const RID = this.requests[this.requestId].RID;

      // изменяем состояние запроса на противоположное
      this.http.get(`/moneyRequests/defray?defrayed=${!cond}&RID=${RID}`).subscribe(
        res => {
          this.isDefraing = false;
          this.requests[this.requestId].bill.isDefrayed = res.defrayed;
        },
        err => {
          this.isDefraing = false;
          console.error(err);
        }
      );
    }
  }
}
