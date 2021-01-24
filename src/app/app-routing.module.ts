import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PleromaComponent} from './components/pleroma/pleroma.component';
import {InruptComponent} from './components/inrupt/inrupt.component';
import {MonitorInboxesComponent} from "./components/monitor-inboxes/monitor-inboxes.component";
import {SendMessageComponent} from "./components/send-message/send-message.component";

const routes: Routes = [
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
