import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-profile-rating',
  templateUrl: './profile-rating.component.html'
})
export class ProfileRatingComponent implements OnInit {
  users = [];
  isLoaded = false;

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.http.get('annotators/rating').subscribe(
      annotators => {
        this.isLoaded = true;

        // обновляем список пользователей
        this.users = annotators;
      },
      error => {
        this.isLoaded = true;
        console.error(error);
      }
    );
  }
}
