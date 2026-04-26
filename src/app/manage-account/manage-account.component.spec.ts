import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {ManageAccountComponent} from './manage-account.component';
import {IsLoadingService} from '../shared/services/is-loading.service';
import {AccountService} from '../shared/services/account.service';
import {AlertService} from '../shared/services/alert.service';

describe('ManageAccountComponent', () => {
  let component: ManageAccountComponent;
  let fixture: ComponentFixture<ManageAccountComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, ManageAccountComponent],
    providers: [
        { provide: IsLoadingService, useValue: { add: async (operation: Promise<unknown>) => operation } },
        {
            provide: AccountService,
            useValue: {
                create: async () => ({ isSuccess: true }),
                update: async () => ({ isSuccess: true }),
            }
        },
        { provide: AlertService, useValue: { showAlert: () => undefined } },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {
                account: {
                    name: '',
                    category: '',
                    username: '',
                    notes: '',
                    isFavorite: false,
                    pattern: '',
                    length: 12,
                    includeSpecialCharacter: true,
                    useCustomSpecialCharacter: false,
                    customSpecialCharacter: '',
                }
            }
        },
    ],
    schemas: [NO_ERRORS_SCHEMA],
});

    TestBed.overrideTemplate(ManageAccountComponent, '');

    await TestBed
      .compileComponents();

    fixture = TestBed.createComponent(ManageAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
