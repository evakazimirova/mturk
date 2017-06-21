import { CommonService } from './../common.service';
import { HttpService } from './../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-rating-mode',
  templateUrl: './rating-mode.component.html',
  styleUrls: ['./rating-mode.component.scss']
})
export class RatingModeComponent implements OnInit {

  constructor(private http: HttpService, private common: CommonService) {}

  ngOnInit() {
  }

  return() {
    const confirmed = confirm('Are you sure you want to leave the task without saving progress?');

    if (confirmed) {
      this.common.mode = 'profile';
    }
  }
}
