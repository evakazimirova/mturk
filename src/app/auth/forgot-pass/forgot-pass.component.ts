import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  constructor(public common: CommonService, private http: HttpService) { }

  ngOnInit() {
  }

  signOut() {
    const obj = {
      id: 10,
      name: 'iGor'
    };

    this.http.post(obj, '/sign/out').subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    );
  }
}
