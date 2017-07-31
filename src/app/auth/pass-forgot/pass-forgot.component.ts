import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'na-pass-forgot',
  templateUrl: './pass-forgot.component.html'
})
export class ForgotPassComponent {
  form: FormGroup;
  loading = false;

  constructor(public common: CommonService,
              private http: HttpService,
              private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'login': ['', [
        Validators.required,
        Validators.pattern('[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})')
      ]]
    });
  }

  forgotPass(event) {
    event.preventDefault(); // отменяем стандартное действие

    if (!this.loading && this.form.valid) {
      // собираем информацию с полей
      const req = {
        email: this.form.value.login
      };

      // отправляем запрос на сервер
      this.loading = true;
      this.http.post(req, '/annotators/forgot').subscribe(
        res => {
          this.loading = false;

          // выводим сообщение об успехе
          this.common.alert(`The instructions have been sent to ${this.form.value.login}.`);
        },
        error => {
          this.loading = false;

          // обработка ошибок
          const status = error._body;
          switch (status) {
            case 'no email':
              this.common.alert('There is no any account matching this email.');
              break;

            default:
              console.error(status);
              break;
          }
        }
      );
    }
  }
}
