import { HttpService } from '../../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('/annotators/registered').subscribe(
      users => this.users = users,
      error => console.log(error)
    )
  }

}
