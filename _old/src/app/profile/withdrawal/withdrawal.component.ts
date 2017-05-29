import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss']
})
export class WithdrawalComponent implements OnInit {
  paymentSystem = 'paypal';

  constructor() { }

  ngOnInit() {
  }

}
