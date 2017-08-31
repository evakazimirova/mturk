import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-pass-change',
  templateUrl: './pass-change.component.html',
  styles: [`
    .img-responsive {
      margin: 50px 0 20px 0;
    }

    label {
      color: #000;
    }
  `]
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(public common: CommonService, private http: HttpService, private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'password': ['', [
        Validators.required,
        Validators.pattern('.{8,}')
      ]]
    });
  }

  ngOnInit() {
  }

  changePassword(event) {
    event.preventDefault();

    if (!this.loading && this.form.valid) {
      this.loading = true;
      this.http.getRough(`/annotators/changePass?password=${this.form.value.password}`).subscribe(
        user => {
          // this.common.user = user;
          // this.common.mode = 'profile';
          // this.loading = false;
          window.location.href = '/'; // просто перезагружаем страницу, чтобы не морочиться с кэшкм (но лучше поморочиться)
        },
        error => {
          this.loading = false;
          console.error(error);
        }
      );
    }
  }
}
