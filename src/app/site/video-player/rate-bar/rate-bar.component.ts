import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-rate-bar',
  templateUrl: './rate-bar.component.html',
  styleUrls: ['./rate-bar.component.scss']
})
export class RateBarComponent implements OnInit {

  constructor(private common: CommonService) { }

  ngOnInit() {
  }

}
