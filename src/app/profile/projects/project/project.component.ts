import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'na-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  @Input() projectId;
  @Output() returned = new EventEmitter();
  projectName;

  constructor() { }

  ngOnInit() {
    switch (this.projectId) {
      case 1:
        this.projectName = 'Mark up a video';
        break;
      case 2:
        this.projectName = 'Event selection';
        break;
    }
  }

  return() {
    this.returned.emit();
  }
}
