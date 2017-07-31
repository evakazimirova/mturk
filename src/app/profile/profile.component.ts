import { Component } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'na-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  profileMode = this.common.profileMode;

  constructor(private common: CommonService) {}
}
