import { CommonService } from './common.service';
import { HttpService } from './http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SiteComponent } from './site.component';
import { TimePipe } from './time.pipe';
import { LoaderBigComponent } from './loaders/loader-big/loader-big.component';

import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPassComponent } from './auth/pass-forgot/pass-forgot.component';
import { ChangePasswordComponent } from './auth/pass-change/pass-change.component';

import { ProfileComponent } from './profile/profile.component';
import { ProfileHeaderComponent } from './profile/profile-header/profile-header.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { ProfileProjectsComponent } from './profile/profile-projects/profile-projects.component';
import { ProjectComponent } from './profile/profile-projects/project/project.component';
import { ProfileRatingComponent } from './profile/profile-rating/profile-rating.component';
import { ProfileWithdrawalComponent } from './profile/profile-withdrawal/profile-withdrawal.component';

import { VideoPlayerComponent } from './rating-mode/video-player/video-player.component';
import { FragmentsListComponent } from './rating-mode/fragments-list/fragments-list.component';
import { RangesComponent } from './rating-mode/fragments-list/ranges/ranges.component';
import { FragmentsComponent } from './rating-mode/fragments-list/fragments/fragments.component';
import { VideoComponent } from './rating-mode/video-player/video/video.component';
import { ProgressComponent } from './rating-mode/video-player/progress/progress.component';
import { ControlsComponent } from './rating-mode/video-player/controls/controls.component';
import { RateBarComponent } from './rating-mode/video-player/rate-bar/rate-bar.component';
import { TipsComponent } from './rating-mode/video-player/tips/tips.component';
import { RatingModeComponent } from './rating-mode/rating-mode.component';

import { AdminComponent } from './admin/admin.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminProjectsComponent } from './admin/admin-projects/admin-projects.component';
import { AdminMoneyRequestsComponent } from './admin/admin-money-requests/admin-money-requests.component';

@NgModule({
  declarations: [
    SiteComponent,
    LoaderBigComponent,
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
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPassComponent,
    ProfileComponent,
    ProjectComponent,
    ProfileHeaderComponent,
    ProfileEditComponent,
    ProfileProjectsComponent,
    ProfileRatingComponent,
    ProfileWithdrawalComponent,
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
  providers: [ HttpService, CommonService ],
  bootstrap: [ SiteComponent ]
})
export class AppModule { }
