import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of} from 'rxjs';

import {AccountsComponent} from './accounts.component';
import {IsLoadingService} from '../shared/services/is-loading.service';
import {AccountService} from '../shared/services/account.service';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../shared/services/alert.service';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AccountsComponent],
    providers: [
        { provide: Router, useValue: { navigateByUrl: () => Promise.resolve(true) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: IsLoadingService, useValue: { add: async (operation: Promise<unknown>) => operation } },
        {
            provide: AccountService,
            useValue: {
                getAll: async () => ({ isSuccess: true, result: [] }),
                update: async () => ({ isSuccess: true }),
                delete: async () => ({ isSuccess: true }),
            }
        },
        { provide: AlertService, useValue: { showAlert: () => undefined } },
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
      .compileComponents();

    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
