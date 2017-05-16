import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  page = "users";

  constructor() { }

  ngOnInit() {
  }

}
