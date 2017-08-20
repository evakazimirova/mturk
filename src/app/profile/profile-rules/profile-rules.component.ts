import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
  selector: 'na-profile-rules',
  templateUrl: './profile-rules.component.html',
  styleUrls: ['./profile-rules.component.scss']
})
export class ProfileRulesComponent implements OnInit {
  rules = '';

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadRerms();
  }

  loadRerms() {
    if (this.rules.length === 0) {
      this.http.getRough('/content/getRules').subscribe(
        rules => {
          this.rules = rules.text();
        },
        error => console.error(error)
      );
    }
  }
}
