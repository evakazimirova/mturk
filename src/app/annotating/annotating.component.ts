import { CommonService } from './../common.service';
import { HttpService } from './../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-annotating',
  templateUrl: './annotating.component.html',
  styleUrls: ['./annotating.component.scss']
})
export class AnnotatingComponent {

  constructor(private http: HttpService, private common: CommonService) {}

  return() {
    const confirmed = confirm('Are you sure you want to leave the task without saving progress?');

    if (confirmed) {
      this.common.mode = 'profile';
    }
  }
}
