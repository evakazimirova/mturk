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

@NgModule({
  declarations: [
    SiteComponent,
    VideoListComponent,
    VideoPlayerComponent,
    FragmentsListComponent,
    TimePipe
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
