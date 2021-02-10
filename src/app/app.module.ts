import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PleromaComponent} from './components/pleroma/pleroma.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AppNavbarComponent} from './components/app-navbar/app-navbar.component';
import {InruptComponent} from './components/inrupt/inrupt.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import {MonitorInboxesComponent} from './components/monitor-inboxes/monitor-inboxes.component';
import {MatListModule} from "@angular/material/list";
import {SendMessageComponent} from "./components/send-message/send-message.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import { IncomingComponent } from './tabs/incoming/incoming.component';
import { SendComponent } from './tabs/send/send.component';
import { VariousComponent } from './tabs/various/various.component';
import { AboutComponent } from './tabs/about/about.component';
import { LoginComponent } from './tabs/login/login.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { AllIncomingComponent } from './tabs/incoming/all-incoming/all-incoming.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { RecipientsPickerComponent } from './components/recipients-picker/recipients-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    PleromaComponent,
    AppNavbarComponent,
    InruptComponent,
    MonitorInboxesComponent,
    SendMessageComponent,
    IncomingComponent,
    SendComponent,
    VariousComponent,
    AboutComponent,
    LoginComponent,
    AllIncomingComponent,
    RecipientsPickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // material
    MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, MatIconModule, MatToolbarModule, MatMenuModule,
    MatSnackBarModule, MatTableModule, MatListModule, MatProgressSpinnerModule, MatRadioModule, MatSidenavModule,
    MatChipsModule, MatAutocompleteModule, ReactiveFormsModule,

    HttpClientModule,
  ],
  providers: [{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 10000}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
