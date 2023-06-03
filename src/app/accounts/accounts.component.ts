import {Component, OnInit} from '@angular/core';
import {Account} from "../shared/models/dto/account";
import {IsLoadingService} from "@service-work/is-loading";
import {AccountService} from "../shared/services/account.service";
import {Router} from "@angular/router";
import {DeleteAccount} from "../shared/models/request/account";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AccountPasswordComponent} from "../account-password/account-password.component";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts: Array<Account>;
  search: FormControl;

  private allAccounts: Array<Account>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loadingService: IsLoadingService,
    private accountService: AccountService) {
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
    }
  }
}
