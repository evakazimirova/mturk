import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  // индикаторы загрузки
  isLoaded = false;
  isBanning = -1;

  // список пользователей
  users = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('/annotators/registered').subscribe(
      users => {
        this.isLoaded = true;

        // обновляем список пользователей
        this.users = users;
      },
      error => {
        this.isLoaded = true;
        console.error(error);
      }
    );
  }

  // баним
  ban(i, AID, banned) {
    // забываем, забанен ли пользователь
    this.users[i].banned = undefined;

    // получаем информацюи о бане с сервера
    this.http.get(`/annotators/ban?AID=${AID}&banned=${!banned}`).subscribe(
      user => this.users[i].banned = user.banned,
      error => console.error(error)
    );
  }
}
