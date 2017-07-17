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
  isDefraing = false;
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

        this.isLoaded = true;
      },
      err => {
        console.error(err);
        this.isLoaded = true;
      }
    );
  }

  defray() {
    if (!this.isDefraing) {
      this.isDefraing = true;
      let cond = this.requests[this.requestId].bill.isDefrayed;
      const RID = this.requests[this.requestId].RID;

      this.http.get(`/moneyRequests/defray?defrayed=${!cond}&RID=${RID}`).subscribe(
        res => {
          this.requests[this.requestId].bill.isDefrayed = res.defrayed
          this.isDefraing = false;
        },
        err => {
          console.error(err);
          this.isDefraing = false;
        }
      );
    }
  }
}
