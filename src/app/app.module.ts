import { VideoPlayerService } from './marking-mode/video-player.service';
import { CommonService } from './common.service';
import { HttpService } from './http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SiteComponent } from './site.component';
import { VideoListComponent } from './rating-mode/video-list/video-list.component';
import { VideoPlayerComponent } from './rating-mode/video-player/video-player.component';
import { FragmentsListComponent } from './rating-mode/fragments-list/fragments-list.component';
import { TimePipe } from './time.pipe';
import { RangesComponent } from './rating-mode/fragments-list/ranges/ranges.component';
import { FragmentsComponent } from './rating-mode/fragments-list/fragments/fragments.component';
import { VideoComponent } from './rating-mode/video-player/video/video.component';
import { ProgressComponent } from './rating-mode/video-player/progress/progress.component';
import { ControlsComponent } from './rating-mode/video-player/controls/controls.component';
import { RateBarComponent } from './rating-mode/video-player/rate-bar/rate-bar.component';
import { TipsComponent } from './rating-mode/video-player/tips/tips.component';
import { RatingModeComponent } from './rating-mode/rating-mode.component';
import { MarkingModeComponent } from './marking-mode/marking-mode.component';
import { TimelineComponent } from './marking-mode/timeline/timeline.component';
import { VideoToMarkComponent } from './marking-mode/video-to-mark/video-to-mark.component';
import { NewFragmentsComponent } from './marking-mode/new-fragments/new-fragments.component';

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
    TipsComponent,
    RatingModeComponent,
    MarkingModeComponent,
    TimelineComponent,
    VideoToMarkComponent,
    NewFragmentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ HttpService, CommonService, VideoPlayerService ],
  bootstrap: [ SiteComponent ]
})
export class AppModule { }
