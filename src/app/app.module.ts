import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpService } from './http.service';
import { CommonService } from './common.service';
import { AnnotatingService } from './profile/annotating/annotating.service';

import { SiteComponent } from './site.component';
import { TimePipe } from './time.pipe';
import { LoaderBigComponent } from './loaders/loader-big/loader-big.component';
import { LoaderInbtnComponent } from './loaders/loader-inbtn/loader-inbtn.component';

import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPassComponent } from './auth/pass-forgot/pass-forgot.component';
import { ChangePasswordComponent } from './auth/pass-change/pass-change.component';

import { ProfileComponent } from './profile/profile.component';
import { ProfileHeaderComponent } from './profile/profile-header/profile-header.component';
import { ProfileProfileComponent } from './profile/profile-profile/profile-profile.component';
import { ProfileProfileEnglishComponent } from './profile/profile-profile/profile-profile-english/profile-profile-english.component';
import { ProfileAccountComponent } from './profile/profile-account/profile-account.component';
import { ProfileProjectsComponent } from './profile/profile-projects/profile-projects.component';
import { ProfileRatingComponent } from './profile/profile-rating/profile-rating.component';
import { ProfileWithdrawalComponent } from './profile/profile-withdrawal/profile-withdrawal.component';
import { ProfileNetworkingComponent } from './profile/profile-networking/profile-networking.component';
import { ProfileFaqComponent } from './profile/profile-faq/profile-faq.component';
import { ProfileRulesComponent } from './profile/profile-rules/profile-rules.component';
import { ProfileTutorialComponent } from './profile/profile-tutorial/profile-tutorial.component';
import { ProfileEmotionsDefinitionsComponent } from './profile/profile-emotions-definitions/profile-emotions-definitions.component';
import { AnnotatingComponent } from './profile/annotating/annotating.component';
import { AnnotatingVideosComponent } from './profile/annotating/annotating-videos/annotating-videos.component';
import { AnnotatingFragmentsComponent } from './profile/annotating/annotating-fragments/annotating-fragments.component';
import { AnnotatingFragmentsRangesComponent } from './profile/annotating/annotating-fragments/annotating-fragments-ranges/annotating-fragments-ranges.component';
import { AnnotatingFragmentsTableComponent } from './profile/annotating/annotating-fragments/annotating-fragments-table/annotating-fragments-table.component';
import { AnnotatingPlayerComponent } from './profile/annotating/annotating-player/annotating-player.component';
import { AnnotatingPlayerVideoComponent } from './profile/annotating/annotating-player/annotating-player-video/annotating-player-video.component';
import { AnnotatingPlayerProgressComponent } from './profile/annotating/annotating-player/annotating-player-progress/annotating-player-progress.component';
import { AnnotatingPlayerControlsComponent } from './profile/annotating/annotating-player/annotating-player-controls/annotating-player-controls.component';
import { AnnotatingPlayerRateBarComponent } from './profile/annotating/annotating-player/annotating-player-ratebar/annotating-player-ratebar.component';

import { AdminComponent } from './admin/admin.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminProjectsComponent } from './admin/admin-projects/admin-projects.component';
import { AdminMoneyRequestsComponent } from './admin/admin-money-requests/admin-money-requests.component';
import { ProfileFaqFeedbackComponent } from './profile/profile-faq/profile-faq-feedback/profile-faq-feedback.component';

@NgModule({
  declarations: [
    SiteComponent,
    LoaderBigComponent,
    LoaderInbtnComponent,
    AnnotatingPlayerComponent,
    AnnotatingFragmentsRangesComponent,
    TimePipe,
    AnnotatingComponent,
    AnnotatingFragmentsTableComponent,
    AnnotatingFragmentsComponent,
    AnnotatingPlayerVideoComponent,
    AnnotatingPlayerProgressComponent,
    AnnotatingPlayerControlsComponent,
    AnnotatingPlayerRateBarComponent,
    AnnotatingVideosComponent,
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPassComponent,
    ProfileComponent,
    ProfileHeaderComponent,
    ProfileProfileComponent,
    ProfileProjectsComponent,
    ProfileRatingComponent,
    ProfileWithdrawalComponent,
    ProfileTutorialComponent,
    AdminComponent,
    AdminHeaderComponent,
    AdminUsersComponent,
    AdminProjectsComponent,
    AdminMoneyRequestsComponent,
    ChangePasswordComponent,
    ProfileNetworkingComponent,
    ProfileFaqComponent,
    ProfileRulesComponent,
    ProfileAccountComponent,
    ProfileProfileEnglishComponent,
    ProfileEmotionsDefinitionsComponent,
    ProfileFaqFeedbackComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [ HttpService, CommonService, AnnotatingService ],
  bootstrap: [ SiteComponent ]
})
export class AppModule { }
