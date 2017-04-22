import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

// 14. Пользователь может создавать фрагменты отмечая начало и конец на таймлайне. Границы фрагмента можно перемещать по таймлайну после их создания.