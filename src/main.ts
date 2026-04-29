import {enableProdMode} from '@angular/core';
import { environment } from './environments/environment';
import {provideNgxWebstorage, withLocalStorage} from 'ngx-webstorage';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {provideAnimations} from '@angular/platform-browser/animations';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideNgxWebstorage(withLocalStorage()),
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}},
  ]
})
  .catch(err => console.error(err));
