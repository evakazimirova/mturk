import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
  }

  signIn() {
    const obj = {
      id: 10,
      name: 'iGor'
    };

    this.http.post(obj, '/sign/in').subscribe(
      res => {
        console.log(res);
        this.common.mode = 'profile';
      },
      err => console.log(err)
    );
  }
}
