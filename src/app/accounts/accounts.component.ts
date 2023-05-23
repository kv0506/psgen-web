import {Component, OnInit} from '@angular/core';
import {Account} from "../shared/models/dto/account";
import {IsLoadingService} from "@service-work/is-loading";
import {AccountService} from "../shared/services/account.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts: Array<Account>;

  constructor(private loadingService: IsLoadingService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.getAccounts();
  }

  private async getAccounts() {
    let resp = await this.loadingService.add(this.accountService.getAll());
    if (resp.isSuccess) {
      this.accounts = resp.result;
    }
  }
}
