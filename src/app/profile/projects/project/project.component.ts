import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'na-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  @Input() projectId;
  @Output() returned = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  return() {
    this.returned.emit();
  }
}
