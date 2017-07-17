import { HttpService } from '../../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-projects',
  templateUrl: './admin-projects.component.html'
})
export class AdminProjectsComponent implements OnInit {
  projectId = 0;
  projects = [];
  isLoaded = false;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('projects/getAll').subscribe(
      projects => {
        this.projects = projects;
        this.isLoaded = true;
      },
      error => {
        console.log(error);
        this.isLoaded = true;
      }
    );
  }

}
