import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';

import {LoginComponent} from './login.component';
import {IsLoadingService} from '../shared/services/is-loading.service';
import {AuthService} from '../shared/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, LoginComponent],
    providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: LocalStorageService, useValue: {} },
        { provide: IsLoadingService, useValue: { add: async (operation: Promise<unknown>) => operation } },
        { provide: AuthService, useValue: { login: async () => ({ isSuccess: true }) } },
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
