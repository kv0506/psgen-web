import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import {IsLoadingService} from "../shared/services/is-loading.service";
import {Account} from "../shared/models/dto/account";
import {CreateAccount, UpdateAccount} from "../shared/models/request/account";
import {AccountService} from "../shared/services/account.service";
import {AlertService} from "../shared/services/alert.service";
import { CdkScrollable } from '@angular/cdk/scrolling';
import { A11yModule } from '@angular/cdk/a11y';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-manage-account',
    templateUrl: './manage-account.component.html',
    styleUrls: ['./manage-account.component.sass'],
  standalone: true,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, MatSlideToggle, MatDialogActions, MatButton, MatDialogClose, A11yModule]
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
      username: [this.data.account.username ?? ''],
      notes: [this.data.account.notes ?? ''],
      isFavorite: [this.data.account.isFavorite ?? false]
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
    if(this.formGroup) {
      let req = new CreateAccount();
    req.name = this.formGroup.value.accountName;
    req.category = this.formGroup.value.accountCategory;
    req.username = this.formGroup.value.username;
    req.pattern = this.data.account.pattern;
    req.length = this.data.account.length;
    req.includeSpecialCharacter = this.data.account.includeSpecialCharacter;
    req.useCustomSpecialCharacter = this.data.account.useCustomSpecialCharacter;
    req.customSpecialCharacter = this.data.account.customSpecialCharacter;
    req.notes = this.formGroup.value.notes;
    req.isFavorite = this.formGroup.value.isFavorite;

    let resp = await this.loadingService.add(this.accountService.create(req));
    if (resp.isSuccess) {
      this.alertService.showAlert(`Account ${req.name} is saved successfully`);
      this.dialogRef.close(true);
    }
    }
  }

  private async updateAccount() {
    if (this.data.account && this.formGroup) {
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
      req.notes = this.formGroup.value.notes;
      req.isFavorite = this.formGroup.value.isFavorite;

      let resp = await this.loadingService.add(this.accountService.update(req));
      if (resp.isSuccess) {
        this.alertService.showAlert(`Account ${req.name} is updated successfully`);
        this.dialogRef.close(true);
      }
    }
  }
}
