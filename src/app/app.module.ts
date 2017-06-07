import { VideoPlayerService } from './marking-mode/video-player.service';
import { CommonService } from './common.service';
import { HttpService } from './http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SiteComponent } from './site.component';
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
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectComponent } from './profile/projects/project/project.component';
import { ProfileHeaderComponent } from './profile/profile-header/profile-header.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { ProjectsComponent } from './profile/projects/projects.component';
import { ProfileRatingComponent } from './profile/profile-rating/profile-rating.component';
import { WithdrawalComponent } from './profile/withdrawal/withdrawal.component';
import { AdminComponent } from './admin/admin.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminProjectsComponent } from './admin/admin-projects/admin-projects.component';
import { AdminMoneyRequestsComponent } from './admin/admin-money-requests/admin-money-requests.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    SiteComponent,
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
    NewFragmentsComponent,
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPassComponent,
    ProfileComponent,
    ProjectComponent,
    ProfileHeaderComponent,
    ProfileEditComponent,
    ProjectsComponent,
    ProfileRatingComponent,
    WithdrawalComponent,
    AdminComponent,
    AdminHeaderComponent,
    AdminUsersComponent,
    AdminProjectsComponent,
    AdminMoneyRequestsComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [ HttpService, CommonService, VideoPlayerService ],
  bootstrap: [ SiteComponent ]
})
export class AppModule { }
