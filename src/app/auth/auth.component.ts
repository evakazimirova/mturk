import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'na-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  formType = 'login';
  constructor(public common: CommonService) {}

  secret() {
    const answer = prompt('Enter password');
    if (answer === 'password') {
      this.common.mode = 'admin';
    }
  }
}
