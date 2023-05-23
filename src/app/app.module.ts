import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";

import {IsLoadingModule} from '@service-work/is-loading';
import {NgxWebstorageModule} from "ngx-webstorage";

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatListModule} from "@angular/material/list";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from './app.component';
import {GeneratePasswordComponent} from './generate-password/generate-password.component';
import {HeaderComponent} from './header/header.component';
import {LoginComponent} from './login/login.component';
import {AccountsComponent} from './accounts/accounts.component';


@NgModule({
  declarations: [
    AppComponent,
    GeneratePasswordComponent,
    HeaderComponent,
    LoginComponent,
    AccountsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatListModule,
    ReactiveFormsModule,
    HttpClientModule,
    IsLoadingModule,
    NgxWebstorageModule.forRoot(),
  ],
  providers: [{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
