import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-money-requests',
  templateUrl: './admin-money-requests.component.html',
  styleUrls: ['./admin-money-requests.component.scss']
})
export class AdminMoneyRequestsComponent implements OnInit {
  requestId = 0;

  requests = [
    {
      id: 0,
      date: +(new Date()),
      user: {
        firstName: 'Игорь',
        secondName: 'Поляков',
        email: 'igor_polyakov@phystech.edu',
        phone: '+7 (926) 883-68-85'
      },
      bill: {
        amount: 1000,
        method: 'PayPal',
        account: '213451213451234',
        isDefrayed: false
      }
    },
    {
      id: 1,
      date: +(new Date(2017, 4, 1, 13, 34, 25)),
      user: {
        firstName: 'Игорь',
        secondName: 'Поляков',
        email: 'igor_polyakov@phystech.edu',
        phone: '+7 (926) 883-68-85'
      },
      bill: {
        amount: 1000,
        method: 'PayPal',
        account: '213451213451234',
        isDefrayed: false
      }
    }
  ];

  requestDataFiller = [
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

  // Телефон
  //       E-mail

  //       Сумма к оплате
  //       Номер счёта
  //       Метод оплаты

  constructor() { }

  ngOnInit() {
  }

}
