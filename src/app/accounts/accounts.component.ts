import {Component, OnInit} from '@angular/core';
import {Account} from "../shared/models/dto/account";
import {IsLoadingService} from "@service-work/is-loading";
import {AccountService} from "../shared/services/account.service";
import {Router} from "@angular/router";
import {DeleteAccount} from "../shared/models/request/account";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts: Array<Account>;

  constructor(private router: Router, private loadingService: IsLoadingService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.getAccounts();
  }

  public editAccount(accountId: string) {
    this.router.navigateByUrl(`generate-password?accountId=${accountId}`);
  }

  public generatePassword(accountId: string) {
    this.router.navigateByUrl(`generate-password?accountId=${accountId}`);
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
      this.accounts = resp.result;
    }
  }
}
