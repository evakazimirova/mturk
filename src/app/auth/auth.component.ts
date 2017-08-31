import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'na-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  formType = 'login';

  constructor(public common: CommonService, private http: HttpService) {}

  secret() {
    const answer = prompt('Enter password');
    if (answer === 'password') {
      this.common.mode = 'admin';
    }
  }

  loadTerms() {
    if (this.common.terms.length === 0) {
      this.http.getRough('/content/getTerms').subscribe(
        terms => {
          this.common.terms = terms.text();
        },
        error => console.error(error)
      );
    }
  }
}
