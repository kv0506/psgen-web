import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of} from 'rxjs';

import {AccountsComponent} from './accounts.component';
import {IsLoadingService} from '../shared/services/is-loading.service';
import {AccountService} from '../shared/services/account.service';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../shared/services/alert.service';
import {Account} from '../shared/models/dto/account';

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

  it('should group accounts by category and sort group names case-insensitively', () => {
    const accounts: Array<Account> = [
      createAccount('1', 'Account 1', 'beta'),
      createAccount('2', 'Account 2', 'Alpha'),
      createAccount('3', 'Account 3', 'alpha'),
    ];

    const groupedAccounts = (component as any).buildGroupedAccounts(accounts);

    expect(groupedAccounts.map((group: any) => group.name)).toEqual(['Alpha', 'Beta']);
    expect(groupedAccounts[0].accounts.length).toBe(2);
    expect(groupedAccounts[1].accounts.length).toBe(1);
  });

  it('should place empty categories into Ungrouped', () => {
    const accounts: Array<Account> = [
      createAccount('1', 'Account 1', ''),
      createAccount('2', 'Account 2', '   '),
    ];

    const groupedAccounts = (component as any).buildGroupedAccounts(accounts);

    expect(groupedAccounts.length).toBe(1);
    expect(groupedAccounts[0].name).toBe('Ungrouped');
    expect(groupedAccounts[0].accounts.length).toBe(2);
  });
});

function createAccount(id: string, name: string, category: string): Account {
  const account = new Account();
  account.id = id;
  account.name = name;
  account.category = category;
  account.username = '';
  account.pattern = '';
  account.length = 20;
  account.includeSpecialCharacter = true;
  account.useCustomSpecialCharacter = false;
  account.customSpecialCharacter = '';
  account.notes = '';
  account.isFavorite = false;
  return account;
}
