import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  @Input() page;
  @Output() pageChanged = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  changePage(event, page) {
    event.preventDefault();
    this.pageChanged.emit(page);
  }
}
