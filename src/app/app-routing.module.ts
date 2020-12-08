import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PleromaComponent} from './components/pleroma/pleroma.component';
import {TestComponent} from './test/test.component';
import {InruptComponent} from './components/inrupt/inrupt.component';

const routes: Routes = [
  { path: 'pleroma', component: PleromaComponent },
  { path: 'inrupt', component: InruptComponent },
  { path: 'test', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
