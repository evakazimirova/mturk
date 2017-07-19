import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'na-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {
  @Input() page;
  @Output() pageChanged = new EventEmitter();

  // смена страницы
  changePage(event, page) {
    event.preventDefault();
    this.pageChanged.emit(page);
  }
}
