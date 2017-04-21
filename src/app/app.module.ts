import { PushService } from './site/push.service';
import { HttpService } from './site/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SiteComponent } from './site/site.component';
import { VideoListComponent } from './site/video-list/video-list.component';
import { VideoPlayerComponent } from './site/video-player/video-player.component';
import { FragmentsListComponent } from './site/fragments-list/fragments-list.component';

@NgModule({
  declarations: [
    SiteComponent,
    VideoListComponent,
    VideoPlayerComponent,
    FragmentsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ HttpService, PushService ],
  bootstrap: [ SiteComponent ]
})
export class AppModule { }
