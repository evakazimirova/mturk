import { HttpService } from '../../http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-profile-rating',
  templateUrl: './profile-rating.component.html',
  styleUrls: ['./profile-rating.component.scss']
})
export class ProfileRatingComponent implements OnInit {
  users = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('annotators/rating').subscribe(
      annotators => {
        this.users = annotators;
      },
      err => console.log(err)
    );
  }

}
