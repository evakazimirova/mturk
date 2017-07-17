import { HttpService } from '../../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-projects',
  templateUrl: './admin-projects.component.html'
})
export class AdminProjectsComponent implements OnInit {
  // индикаторы загрузки
  isLoaded = false;

  // проекты
  projects = [];
  projectId = 0;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('projects/getAll').subscribe(
      projects => {
        this.isLoaded = true;

        // обновляем список проектов
        this.projects = projects;
      },
      error => {
        this.isLoaded = true;
        console.error(error);
      }
    );
  }
}
