import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PleromaComponent} from './components/pleroma/pleroma.component';
import {NotificationsComponent} from "./components/notifications/notifications.component";
import {AuthGuardService} from "./services/auth-guard/auth-guard.service";
import {LoginComponent} from "./tabs/login/login.component";
import {IncomingComponent} from "./tabs/incoming/incoming.component";
import {SendSimpleComponent} from "./tabs/send/send-simple/send-simple.component";
import {AboutComponent} from "./tabs/about/about.component";
import {INCOMING_ROUTES} from "./tabs/incoming/incoming.routes";
import {SendActivityStreamsComponent} from "./tabs/send/send-activity-streams/send-activity-streams.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'incoming', component: IncomingComponent, canActivate: [AuthGuardService], children: INCOMING_ROUTES},
  { path: 'send', component: SendActivityStreamsComponent, canActivate: [AuthGuardService]},
  { path: 'send/simple', component: SendSimpleComponent, canActivate: [AuthGuardService]},
  { path: 'monitor', component: NotificationsComponent, canActivate: [AuthGuardService]},

  { path: 'notifications', component: NotificationsComponent},
  { path: 'about', component: AboutComponent },
  { path: 'pleroma', component: PleromaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
