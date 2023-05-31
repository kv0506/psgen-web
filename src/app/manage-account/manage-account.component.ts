import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IsLoadingService} from "@service-work/is-loading";
import {Account} from "../shared/models/dto/account";
import {CreateAccount, UpdateAccount} from "../shared/models/request/account";
import {AccountService} from "../shared/services/account.service";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.sass']
})
export class ManageAccountComponent implements OnInit {
  public formGroup: FormGroup;
  public submitInProgress: boolean | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: IsLoadingService,
    private dialogRef: MatDialogRef<ManageAccountComponent>,
    private accountService: AccountService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: { account: Account },
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      accountName: [this.data.account.name ?? '', Validators.required],
      accountCategory: [this.data.account.category ?? ''],
      username: [this.data.account.username ?? '']
    });
  }

  public async onSubmit() {
    if (this.data.account.id) {
      this.updateAccount();
    } else {
      this.createAccount();
    }
  }

  private async createAccount() {
    let req = new CreateAccount();
    req.name = this.formGroup.value.accountName;
    req.category = this.formGroup.value.accountCategory;
    req.username = this.formGroup.value.username;
    req.pattern = this.data.account.pattern;
    req.length = this.data.account.length;
    req.includeSpecialCharacter = this.data.account.includeSpecialCharacter;
    req.useCustomSpecialCharacter = this.data.account.useCustomSpecialCharacter;
    req.customSpecialCharacter = this.data.account.customSpecialCharacter;

    let resp = await this.loadingService.add(this.accountService.create(req));
    if (resp.isSuccess) {
      this.alertService.showError(`Account ${req.name} is saved successfully`);
      this.dialogRef.close(true);
    }
  }

  private async updateAccount() {
    if (this.data.account) {
      let req = new UpdateAccount();
      req.id = this.data.account.id;
      req.name = this.formGroup.value.accountName;
      req.category = this.formGroup.value.accountCategory;
      req.username = this.formGroup.value.username;
      req.pattern = this.data.account.pattern;
      req.length = this.data.account.length;
      req.includeSpecialCharacter = this.data.account.includeSpecialCharacter;
      req.useCustomSpecialCharacter = this.data.account.useCustomSpecialCharacter;
      req.customSpecialCharacter = this.data.account.customSpecialCharacter;

      let resp = await this.loadingService.add(this.accountService.update(req));
      if (resp.isSuccess) {
        this.alertService.showError(`Account ${req.name} is updated successfully`);
        this.dialogRef.close(true);
      }
    }
  }
}
