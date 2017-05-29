import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
  form: FormGroup;

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

    this.http.post(req, '/sign/in').subscribe(
      user => {
        this.common.user = user;
        this.common.mode = 'profile';
      },
      err => console.log(err)
    );
  }



  forgotPass(event) {
    event.preventDefault();

    const req = {
      email: this.form.value.login
    };

    this.http.post(req, '/sign/forgot').subscribe(
      res => {
        console.log(`The instructions have been sent to ${this.form.value.login}.`)
      },
      err => console.log(err)
    );
  }
}
