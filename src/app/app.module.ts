import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PleromaComponent} from './components/pleroma/pleroma.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AppNavbarComponent} from './components/app-navbar/app-navbar.component';
import {InruptComponent} from './components/inrupt/inrupt.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import {TestComponent} from "./test/test.component";

@NgModule({
  declarations: [
    AppComponent,
    PleromaComponent,
    AppNavbarComponent,
    InruptComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // material
    MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, MatIconModule, MatToolbarModule, MatMenuModule,
    MatSnackBarModule, MatTableModule,

    HttpClientModule,
  ],
  providers: [{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 10000}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
