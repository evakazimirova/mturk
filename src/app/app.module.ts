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

import { AnnotatingComponent } from './annotating/annotating.component';
import { AnnotatingFragmentsComponent } from './annotating/annotating-fragments/annotating-fragments.component';
import { AnnotatingFragmentsRangesComponent } from './annotating/annotating-fragments/annotating-fragments-ranges/annotating-fragments-ranges.component';
import { AnnotatingFragmentsTableComponent } from './annotating/annotating-fragments/annotating-fragments-table/annotating-fragments-table.component';
import { AnnotatingVideosComponent } from './annotating/annotating-videos/annotating-videos.component';
import { AnnotatingPlayerComponent } from './annotating/annotating-player/annotating-player.component';

// import { AnnotatingPlayerComponent } from './annotating/annotating-player/annotating-player.component';
// import { AnnotatingPlayerComponent } from './annotating/annotating-player/annotating-player.component';
// import { AnnotatingPlayerComponent } from './annotating/annotating-player/annotating-player.component';
// import { AnnotatingPlayerComponent } from './annotating/annotating-player/annotating-player.component';
// import { AnnotatingPlayerComponent } from './annotating/annotating-player/annotating-player.component';
import { VideoComponent } from './annotating/annotating-player/video/video.component';
import { ProgressComponent } from './annotating/annotating-player/progress/progress.component';
import { ControlsComponent } from './annotating/annotating-player/controls/controls.component';
import { RateBarComponent } from './annotating/annotating-player/rate-bar/rate-bar.component';
import { TipsComponent } from './annotating/annotating-player/tips/tips.component';

import { AdminComponent } from './admin/admin.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminProjectsComponent } from './admin/admin-projects/admin-projects.component';
import { AdminMoneyRequestsComponent } from './admin/admin-money-requests/admin-money-requests.component';

@NgModule({
  declarations: [
    SiteComponent,
    LoaderBigComponent,
    AnnotatingPlayerComponent,
    AnnotatingFragmentsRangesComponent,
    TimePipe,
    AnnotatingFragmentsTableComponent,
    AnnotatingFragmentsComponent,
    VideoComponent,
    ProgressComponent,
    ControlsComponent,
    RateBarComponent,
    TipsComponent,
    AnnotatingVideosComponent,
    AnnotatingComponent,
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
