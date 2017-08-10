import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'na-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  loading = false;
  validForce = false;

  constructor(private formBuilder: FormBuilder,
              public common: CommonService,
              private http: HttpService) {
    this.form = formBuilder.group({
      'login': ['', [
        Validators.required
      ]],
      'password': ['', [
        Validators.required,
        Validators.pattern('.{8,}')
      ]]
    });
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.form.valid) {
        this.validForce = true;
      }
    }, 2000);
  }

  signIn(event) {
    event.preventDefault(); // отменяем стандартное действие

    if (!this.loading && this.form.valid) {
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
        error => {
          this.loading = false;

          // обработка ошибок
          const status = error._body;
          switch (status) {
            case 'no email':
              this.common.alert('There is no annotator registered with such email or login.');
              break;

            case 'incorrect password':
              this.common.alert('The password entered is wrong. Try again of request the new one.');
              break;

            case 'email is not validated':
              this.common.alert('This email is not veryfied. Please, checkout your inbox to continue registration.');
              break;

            case 'banned':
              this.common.alert('Sorry, but you are not able to use this service. You can <a href="mailto:info@emotionminer.com">contact the administrator</a> to figure out this issue.');
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
