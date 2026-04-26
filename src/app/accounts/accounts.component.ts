import {Component, OnInit} from '@angular/core';
import {Account} from "../shared/models/dto/account";
import {IsLoadingService} from "../shared/services/is-loading.service";
import {AccountService} from "../shared/services/account.service";
import {Router} from "@angular/router";
import {DeleteAccount, UpdateAccount} from "../shared/models/request/account";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AccountPasswordComponent} from "../account-password/account-password.component";
import {AlertService} from "../shared/services/alert.service";
import { NgIf, NgFor } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type AccountGroup = {
  name: string,
  accounts: Array<Account>
};

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.sass'],
    imports: [ReactiveFormsModule, NgIf, NgFor, MatIconButton, MatIcon]
})
export class AccountsComponent implements OnInit {
  accounts: Array<Account> = [];
  favorites: Array<Account> = [];
  groupedAccounts: Array<AccountGroup> = [];
  search!: FormControl;

  private allAccounts: Array<Account> = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loadingService: IsLoadingService,
    private accountService: AccountService,
    private alertService: AlertService,) {
  }

  ngOnInit(): void {
    this.search = new FormControl<any>('');
    this.getAccounts();
  }

  public searchQueryChanged() {
    this.accounts = this.allAccounts.filter(x => x.name.toLowerCase().includes(this.search.value.toLowerCase()));
    this.groupedAccounts = this.buildGroupedAccounts(this.accounts);
  }

  public editAccount(accountId: string) {
    this.router.navigateByUrl(`generate-password?accountId=${accountId}`);
  }

  public favoriteAccount(accountId: string) {
    let account = this.allAccounts.find(x => x.id == accountId);
    if (account) {
      account.isFavorite = !account.isFavorite;
      this.updateAccount(account).then(r => {
        this.getAccounts();
      });
    }
  }

  public generatePassword(account: Account) {
    const dialogRef = this.dialog.open(AccountPasswordComponent, {
      data: {account: account},
      minWidth: '350px',
    });
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
      }
    });
  }

  public async deleteAccount(accountId: string) {
    let req = new DeleteAccount();
    req.id = accountId;
    let resp = await this.loadingService.add(this.accountService.delete(req));
    if (resp.isSuccess) {
      this.getAccounts();
    }
  }

  private async getAccounts() {
    let resp = await this.loadingService.add(this.accountService.getAll());
    if (resp.isSuccess) {
      this.allAccounts = resp.result;
      this.accounts = resp.result;
      this.favorites = resp.result.filter(x => x.isFavorite);
      this.groupedAccounts = this.buildGroupedAccounts(this.accounts);
    }
  }

  private buildGroupedAccounts(accounts: Array<Account>): Array<AccountGroup> {
    const grouped = new Map<string, AccountGroup>();

    for (const account of accounts) {
      const groupKey = this.getGroupKey(account);

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          name: this.getDisplayGroupName(groupKey),
          accounts: []
        });
      }

      grouped.get(groupKey)?.accounts.push(account);
    }

    return Array.from(grouped.values())
      .sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}));
  }

  private getGroupKey(account: Account): string {
    const rawGroupName = (account as any).groupName ?? (account as any).group ?? account.category;
    const groupName = rawGroupName?.toString().trim().toLowerCase();

    return groupName || 'Ungrouped';
  }

  private getDisplayGroupName(groupKey: string): string {
    return groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
  }

  private async updateAccount(account: Account) {
    if (account) {
      let req = new UpdateAccount();
      req.id = account.id;
      req.name = account.name;
      req.category = account.category;
      req.username = account.username;
      req.pattern = account.pattern;
      req.length = account.length;
      req.includeSpecialCharacter = account.includeSpecialCharacter;
      req.useCustomSpecialCharacter = account.useCustomSpecialCharacter;
      req.customSpecialCharacter = account.customSpecialCharacter;
      req.notes = account.notes;
      req.isFavorite = account.isFavorite;

      let resp = await this.loadingService.add(this.accountService.update(req));
      if (resp.isSuccess) {
        this.alertService.showAlert(`Account ${req.name} is updated successfully`);
      }
    }
  }
}
