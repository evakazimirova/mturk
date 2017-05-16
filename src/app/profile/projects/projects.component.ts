import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectMode = false;
  projectId = 0;

  projects = {
    marking: [
      {
        id: 1,
        title: 'Video "sharapova"',
        activity: "Active",
        percentage: 90,
        earned: function() {
          return +(this.price * this.percentage / 100).toFixed(0);
        },
        price: 5000
      }
    ],
    annotating: [
      {
        id: 17,
        title: 'Video "bilan_0004"',
        activity: "Inactive",
        percentage: 0,
        earned: function() {
          return +(this.price * this.percentage / 100).toFixed(0);
        },
        price: 3000
      },
      {
        id: 99,
        title: 'Video "bilan_0005"',
        activity: "Contest stage",
        percentage: 0,
        earned: function() {
          return +(this.price * this.percentage / 100).toFixed(0);
        },
        price: 1000
      }
    ]
  }

  constructor(public common: CommonService) { }

  ngOnInit() {
  }

  // Если аннотатор подписался на задачу, то стоимость для него фиксируется, и отображается в личном кабинете именно в том размере на который он подписался, даже если администратор для новых аннотаторов увеличил или уменьшил размер выплаты.
}
