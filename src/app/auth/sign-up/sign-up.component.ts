import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../common.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  form: FormGroup;

  constructor(public common: CommonService, private http: HttpService, private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'firstName': ['', [
        Validators.required
      ]],
      'secondName': ['', [
        Validators.required
      ]],
      'login': ['', [
        Validators.required
      ]],
      'email': ['', [
        Validators.required,
        Validators.pattern('[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})')
      ]],
      'password': ['', [
        Validators.required,
        Validators.pattern('.{5,}')
      ]]
    });
  }

  ngOnInit() {
  }

  signUp(event) {
    event.preventDefault();

    const userData = {
      firstName: this.form.value.firstName,
      secondName: this.form.value.secondName,
      login: this.form.value.login,
      email: this.form.value.email.toLowerCase(),
      password: this.form.value.password
    };

    this.http.post(userData, '/sign/up').subscribe(
      res => {
        console.log(res);
      },
      error => {
        const status = error._body;
        switch (status) {
          case 'user exists':
            // если такой пользователь уже есть, то предлагается восстановить пароль
            console.log('Annotator with this email is already exists in the system.');
            break;

          default:
            console.log(status);
            break;
        }
      }
    );
  }
}
