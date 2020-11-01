import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PleromaComponent} from './components/pleroma/pleroma.component';
import {PleromaOAuthComponent} from './components/pleroma-oauth/pleroma-oauth.component';

const routes: Routes = [
  { path: 'pleroma', component: PleromaComponent },
  { path: 'pleroma/oauth', component: PleromaOAuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
