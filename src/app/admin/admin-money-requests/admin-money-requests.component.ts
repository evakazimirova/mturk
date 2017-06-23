import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-admin-money-requests',
  templateUrl: './admin-money-requests.component.html',
  styleUrls: ['./admin-money-requests.component.scss']
})
export class AdminMoneyRequestsComponent implements OnInit {
  requestId = 0;
  isLoaded = false;
  requests = [];
  requestDataFiller = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('/moneyRequests/getAll').subscribe(
      requests => {
        this.requests = requests;


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


        // console.log(requests);
        this.isLoaded = true;
      },
      err => {
        console.log(err);
        this.isLoaded = true;
      }
    );
  }

}
