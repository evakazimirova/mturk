import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'na-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  form: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              public common: CommonService,
              private http: HttpService) {
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

  signIn(event) {
    event.preventDefault(); // отменяем стандартное действие

    // собираем информацию с полей
    const req = {
      login: this.form.value.login,
      password: this.form.value.password
    };

    // отправляем запрос на сервер
    this.loading = true;
    this.http.post(req, '/annotators/login').subscribe(
      user => {
        this.loading = false;

        // входим в систему
        this.common.user = user;
        this.common.mode = 'profile';
      },
      err => {
        this.loading = false;
        console.error(err);
      }
    );
  }
}
