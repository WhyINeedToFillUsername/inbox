import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PleromaComponent} from './components/pleroma/pleroma.component';
import {MonitorInboxesComponent} from "./components/monitor-inboxes/monitor-inboxes.component";
import {AuthGuardService} from "./services/auth-guard/auth-guard.service";
import {LoginComponent} from "./tabs/login/login.component";
import {IncomingComponent} from "./tabs/incoming/incoming.component";
import {SendComponent} from "./tabs/send/send.component";
import {AboutComponent} from "./tabs/about/about.component";
import {INCOMING_ROUTES} from "./tabs/incoming/incoming.routes";
import {SendActivityPubComponent} from "./tabs/send/send-activity-pub/send-activity-pub.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'incoming', component: IncomingComponent, canActivate: [AuthGuardService], children: INCOMING_ROUTES},
  { path: 'send', component: SendComponent, canActivate: [AuthGuardService]},
  { path: 'send/activity-pub', component: SendActivityPubComponent, canActivate: [AuthGuardService]},

  { path: 'about', component: AboutComponent },
  { path: 'pleroma', component: PleromaComponent },
  { path: 'monitor', component: MonitorInboxesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
