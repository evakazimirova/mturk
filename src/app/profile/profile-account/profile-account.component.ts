import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'na-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.scss']
})
export class ProfileAccountComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(public common: CommonService,
              private http: HttpService,
              private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'login': [{value: '', disabled: true}, [
        Validators.required
      ]],
      'email': [{value: '', disabled: true}, [
        Validators.required,
        Validators.pattern('[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})')
      ]],
      'socials': ['', [
        Validators.required
      ]],
      'phone': ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit() {
    this.http.get('Annotators/getData').subscribe(
      profile => {
        this.form.patchValue(profile);
      },
      error => console.error(error)
    );
  }

  updateAnnotatorAccount(event) {
    event.preventDefault(); // отменяем стандартное действие

    if (this.form.valid) {
      if (!this.loading) {
        // отправляем запрос на сервер
        this.loading = true;
        this.http.post(this.form.value, '/annotators/updateAccount').subscribe(
          res => {
            this.loading = false;
          },
          error => {
            this.loading = false;
            console.error(error);
          }
        );
      }
    } else {
      console.log('Заполнены не все поля!');
    }
  }
}
