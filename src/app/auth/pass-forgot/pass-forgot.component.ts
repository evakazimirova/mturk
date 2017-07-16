import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-pass-forgot',
  templateUrl: './pass-forgot.component.html',
  styleUrls: ['./pass-forgot.component.scss']
})
export class ForgotPassComponent implements OnInit {
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

  forgotPass(event) {
    event.preventDefault();

    const req = {
      email: this.form.value.login
    };

    this.loading = true;
    this.http.post(req, '/annotators/forgot').subscribe(
      res => {
        console.log(`The instructions have been sent to ${this.form.value.login}.`);
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    );
  }
}
