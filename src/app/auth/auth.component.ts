import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  formType = 'reg';

  constructor() { }

  ngOnInit() {
  }

}
