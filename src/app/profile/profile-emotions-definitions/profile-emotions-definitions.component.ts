import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-profile-emotions-definitions',
  templateUrl: './profile-emotions-definitions.component.html',
  styleUrls: ['./profile-emotions-definitions.component.scss']
})
export class ProfileEmotionsDefinitionsComponent implements OnInit {
  emotionsDefinitions = '';

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadEmotionsDefinitions();
  }

  loadEmotionsDefinitions() {
    console.log(this.emotionsDefinitions.length);
    if (this.emotionsDefinitions.length === 0) {
      this.http.getRough('/content/getEmotionsDefinitions').subscribe(
        emotionsDefinitions => {
          console.log(emotionsDefinitions);

          this.emotionsDefinitions = emotionsDefinitions.text();
        },
        error => console.error(error)
      );
    }
  }
}
