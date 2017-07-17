import { Component, OnInit } from '@angular/core';
import { CommonService } from './../common.service';
import { HttpService } from './../http.service';

@Component({
  selector: 'na-annotating',
  templateUrl: './annotating.component.html',
  styleUrls: ['./annotating.component.scss']
})
export class AnnotatingComponent {
  constructor(private common: CommonService) {}

  // вернуться к списку проектов
  return() {
    // подтверждение действия
    const confirmed = confirm('Are you sure you want to leave the task without saving progress?');
    if (confirmed) {
      // переход к списку проектов
      this.common.mode = 'profile';
    }
  }
}
