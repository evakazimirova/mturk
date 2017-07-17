import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { CommonService } from './../common.service';
import { AnnotatingService } from './../annotating/annotating.service';

@Component({
  selector: 'na-annotating',
  templateUrl: './annotating.component.html',
  styleUrls: ['./annotating.component.scss']
})
export class AnnotatingComponent {
  constructor(private common: CommonService,
              public annot: AnnotatingService) {}

  // вернуться к списку проектов
  return() {
    // подтверждение действия
    const confirmed = confirm('Are you sure you want to leave the task without saving progress?');
    if (confirmed) {
      // переход к списку проектов
      this.common.mode = 'profile';

      // чтобы плеер не ругался при повторном запуске
      this.annot.allFragmentsRated = true;
    }
  }
}
