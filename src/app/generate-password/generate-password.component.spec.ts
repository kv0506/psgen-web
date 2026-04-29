import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

import {GeneratePasswordComponent} from './generate-password.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';
import {IsLoadingService} from '../shared/services/is-loading.service';
import {MatDialog} from '@angular/material/dialog';
import {PasswordHashService} from '../shared/services/password-hash.service';
import {AuthService} from '../shared/services/auth.service';
import {AccountService} from '../shared/services/account.service';

describe('GeneratePasswordComponent', () => {
  let component: GeneratePasswordComponent;
  let fixture: ComponentFixture<GeneratePasswordComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, GeneratePasswordComponent],
    providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: MatSnackBar, useValue: { open: () => undefined } },
        { provide: Clipboard, useValue: { copy: () => true } },
        { provide: IsLoadingService, useValue: { add: async (operation: Promise<unknown>) => operation } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: PasswordHashService, useValue: { createPassword: () => 'mock-password' } },
        { provide: AuthService, useValue: { isLoggedIn: () => false } },
        { provide: AccountService, useValue: { get: async () => ({ isSuccess: true }) } },
    ],
    schemas: [NO_ERRORS_SCHEMA],
});

    TestBed.overrideTemplate(GeneratePasswordComponent, '');

    await TestBed
      .compileComponents();

    fixture = TestBed.createComponent(GeneratePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
