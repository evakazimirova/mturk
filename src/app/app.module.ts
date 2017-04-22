import { CommonService } from './site/common.service';
import { HttpService } from './site/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SiteComponent } from './site/site.component';
import { VideoListComponent } from './site/video-list/video-list.component';
import { VideoPlayerComponent } from './site/video-player/video-player.component';
import { FragmentsListComponent } from './site/fragments-list/fragments-list.component';
import { TimePipe } from './time.pipe';
import { RangesComponent } from './site/fragments-list/ranges/ranges.component';
import { FragmentsComponent } from './site/fragments-list/fragments/fragments.component';
import { VideoComponent } from './site/video-player/video/video.component';
import { ProgressComponent } from './site/video-player/progress/progress.component';
import { ControlsComponent } from './site/video-player/controls/controls.component';
import { RateBarComponent } from './site/video-player/rate-bar/rate-bar.component';
import { TipsComponent } from './site/video-player/tips/tips.component';

@NgModule({
  declarations: [
    SiteComponent,
    VideoListComponent,
    VideoPlayerComponent,
    FragmentsListComponent,
    TimePipe,
    RangesComponent,
    FragmentsComponent,
    VideoComponent,
    ProgressComponent,
    ControlsComponent,
    RateBarComponent,
    TipsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ HttpService, CommonService ],
  bootstrap: [ SiteComponent ]
})
export class AppModule { }
