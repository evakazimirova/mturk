import { HttpService } from '../../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users = [];
  isLoaded = false;
  isBanning = -1;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('/annotators/registered').subscribe(
      users => {
        this.users = users;
        this.isLoaded = true;
      },
      error => {
        console.log(error);
        this.isLoaded = true;
      }
    );
  }

  ban(i, AID, banned) {
    this.users[i].banned = undefined;
    this.http.get(`/annotators/ban?AID=${AID}&banned=${!banned}`).subscribe(
      user => {
        console.log(user)
        this.users[i].banned = user.banned;
        // this.isBanning = -1;
      },
      error => {
        console.log(error);
        // this.isBanning = -1;
      }
    );
  }

}
