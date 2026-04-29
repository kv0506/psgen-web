import {Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {Router} from "@angular/router";
import {LocalStorageService} from "ngx-webstorage";
import {IsLoadingService} from "../shared/services/is-loading.service";
import {AuthService} from "../shared/services/auth.service";
import {LoginRequest} from "../shared/models/request/login";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel, MatInput, MatError } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass'],
  standalone: true,
    imports: [ReactiveFormsModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatDivider, MatFormField, MatLabel, MatInput, NgIf, MatError, MatButton]
})
export class LoginComponent {
  public formGroup: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private loadingService: IsLoadingService,
    private authService: AuthService
  ) {
  }

  public get username() {
    return this.formGroup.get('username');
  }

  public get password() {
    return this.formGroup.get('password');
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public async onSubmit() {
    let req = new LoginRequest();
    req.username = this.formGroup.value.username;
    req.password = this.formGroup.value.password;

    let resp = await this.loadingService.add(this.authService.login(req));
    if (resp.isSuccess) {
      await this.router.navigate(['/accounts']).then(value => {
        window.location.reload();
      });
    } else {
      //show error
    }
  }
}
