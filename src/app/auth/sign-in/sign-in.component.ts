import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(public common: CommonService, private http: HttpService, private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'login': ['', [
        Validators.required
      ]],
      'password': ['', [
        Validators.required,
        Validators.pattern('.{5,}')
      ]]
    });
  }

  ngOnInit() {
  }

  signIn(event) {
    event.preventDefault();

    const req = {
      login: this.form.value.login,
      password: this.form.value.password
    };

    this.loading = true;
    this.http.post(req, '/annotators/login').subscribe(
      user => {
        this.common.user = user;
        this.common.mode = 'profile';
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    );
  }
}
