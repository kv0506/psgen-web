import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GeneratePasswordComponent} from "./generate-password/generate-password.component";
import {LoginComponent} from "./login/login.component";
import {AccountsComponent} from "./accounts/accounts.component";

const routes: Routes = [
  {path: '', component: GeneratePasswordComponent},
  {path: 'login', component: LoginComponent},
  {path: 'accounts', component: AccountsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
