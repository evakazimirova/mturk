import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../common.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent {
  form: FormGroup;
  loading = false;

  constructor(public common: CommonService,
              private http: HttpService,
              private formBuilder: FormBuilder) {
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

  signUp(event) {
    event.preventDefault(); // отменяем стандартное действие

    // собираем информацию с полей
    const userData = {
      firstName: this.form.value.firstName,
      secondName: this.form.value.secondName,
      login: this.form.value.login,
      email: this.form.value.email.toLowerCase(),
      password: this.form.value.password
    };

    // отправляем запрос на сервер
    this.loading = true;
    this.http.post(userData, '/annotators/register').subscribe(
      user => {
        this.loading = false;

        // выводим сообщение об успехе
        this.common.alert(`We have sent an e-mail to the "${user.email}". Please check it out!`);
      },
      error => {
        this.loading = false;

        // обработка ошибок
        const status = error._body;
        switch (status) {
          case 'user exists':
            // если такой пользователь уже есть, то предлагается восстановить пароль
            console.error('Annotator with this email is already exists in the system.');
            break;

          default:
            console.error(status);
            break;
        }
      }
    );
  }
}
