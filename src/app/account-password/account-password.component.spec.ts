import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {Clipboard} from '@angular/cdk/clipboard';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {AccountPasswordComponent} from './account-password.component';
import {PasswordHashService} from '../shared/services/password-hash.service';

describe('AccountPasswordComponent', () => {
  let component: AccountPasswordComponent;
  let fixture: ComponentFixture<AccountPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, AccountPasswordComponent],
    providers: [
        { provide: Clipboard, useValue: { copy: () => true } },
        { provide: MatSnackBar, useValue: { open: () => undefined } },
        { provide: PasswordHashService, useValue: { createPassword: () => 'mock-password' } },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {
                account: {
                    pattern: 'test',
                    length: 12,
                    includeSpecialCharacter: true,
                    useCustomSpecialCharacter: false,
                    customSpecialCharacter: ''
                }
            }
        },
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
      .compileComponents();

    fixture = TestBed.createComponent(AccountPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
