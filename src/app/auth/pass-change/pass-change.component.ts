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
        Validators.pattern('.{5,}')
      ]]
    });
  }

  ngOnInit() {
  }

  changePassword(event) {
    event.preventDefault();

    const req = {
      password: this.form.value.password
    };

    this.loading = true;
    this.http.post(req, '/annotators/changePass').subscribe(
      user => {
        this.common.user = user;
        this.common.mode = 'profile';
        this.loading = false;
      },
      err => {
        console.error(err);
        this.loading = false;
      }
    );
  }
}
