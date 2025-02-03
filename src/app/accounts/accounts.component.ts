import {Component, OnInit} from '@angular/core';
import {Account} from "../shared/models/dto/account";
import {IsLoadingService} from "@service-work/is-loading";
import {AccountService} from "../shared/services/account.service";
import {Router} from "@angular/router";
import {DeleteAccount, UpdateAccount} from "../shared/models/request/account";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AccountPasswordComponent} from "../account-password/account-password.component";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts: Array<Account>;
  favorites: Array<Account>;
  search: FormControl;

  private allAccounts: Array<Account>;

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
    dialogRef.afterClosed().subscribe((result) => {
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
    }
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
        this.alertService.showError(`Account ${req.name} is updated successfully`);
      }
    }
  }
}
