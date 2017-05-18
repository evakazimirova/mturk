import { CommonService } from '../../common.service';
import { HttpService } from '../../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
  }

  signUp() {
    const obj = {
      id: 10,
      name: 'iGor'
    };

    this.http.post(obj, '/sign/up').subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    );
  }
}
