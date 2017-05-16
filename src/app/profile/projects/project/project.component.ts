import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'na-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  @Input() projectId;

  constructor() { }

  ngOnInit() {
  }

}
