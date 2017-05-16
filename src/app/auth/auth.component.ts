import { CommonService } from '../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  formType = 'reg';

  constructor(public common: CommonService) { }

  ngOnInit() {
  }

  secret() {
    const answer = prompt("Enter password");
    if (answer === "password") {
      this.common.mode = 'admin';
    }
  }

}
