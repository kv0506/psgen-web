import {Component, OnInit} from '@angular/core';
import {Account} from "../shared/models/dto/account";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts: Array<Account>;

  ngOnInit(): void {
  }

}
