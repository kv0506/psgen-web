import {Routes} from '@angular/router';
import {GeneratePasswordComponent} from './generate-password/generate-password.component';
import {LoginComponent} from './login/login.component';
import {AccountsComponent} from './accounts/accounts.component';

export const routes: Routes = [
  {path: '', component: GeneratePasswordComponent},
  {path: 'generate-password', component: GeneratePasswordComponent},
  {path: 'login', component: LoginComponent},
  {path: 'accounts', component: AccountsComponent},
];
