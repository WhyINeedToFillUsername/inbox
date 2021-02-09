import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PleromaComponent} from './components/pleroma/pleroma.component';
import {InruptComponent} from './components/inrupt/inrupt.component';
import {MonitorInboxesComponent} from "./components/monitor-inboxes/monitor-inboxes.component";
import {SendMessageComponent} from "./components/send-message/send-message.component";
import {AuthGuardService} from "./services/auth-guard/auth-guard.service";
import {LoginComponent} from "./tabs/login/login.component";
import {IncomingComponent} from "./tabs/incoming/incoming.component";
import {SendComponent} from "./tabs/send/send.component";
import {VariousComponent} from "./tabs/various/various.component";
import {AboutComponent} from "./tabs/about/about.component";
import {INCOMING_ROUTES} from "./tabs/incoming/incoming.routes";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'incoming', component: IncomingComponent, canActivate: [AuthGuardService], children: INCOMING_ROUTES},
  { path: 'send', component: SendComponent, canActivate: [AuthGuardService]},
  { path: 'various', component: VariousComponent },
  { path: 'about', component: AboutComponent },

  { path: 'pleroma', component: PleromaComponent },
  { path: 'inrupt', component: InruptComponent },
  { path: 'send', component: SendMessageComponent },
  { path: 'monitor', component: MonitorInboxesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
