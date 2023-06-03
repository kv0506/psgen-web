import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Account} from "../shared/models/dto/account";
import {Clipboard} from "@angular/cdk/clipboard";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PasswordHashService} from "../shared/services/password-hash.service";

@Component({
  selector: 'app-account-password',
  templateUrl: './account-password.component.html',
  styleUrls: ['./account-password.component.sass']
})
export class AccountPasswordComponent implements OnInit{
  public formGroup: FormGroup;
  public displayPassword: boolean = false;
  public displayPin: boolean = false;
  public passwordText: string | undefined;
  private resultPassword: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private passwordHashService: PasswordHashService,
    private dialogRef: MatDialogRef<AccountPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account: Account },
  ) {
  }

  public get pin() {
    return this.formGroup.get('pin');
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
    });
  }

  public showPasswordChanged() {
    this.displayPassword = !this.displayPassword;
    this.setPassword(this.displayPassword);
  }

  public copyPassword() {
    if (this.resultPassword) {
      this.clipboard.copy(this.resultPassword);
      this.snackBar.open('Password copied', 'DISMISS');
    }
  }

  public generatePassword() {
    if (!this.formGroup.valid)
      return;

    console.log('submit');

    let actualPattern = this.data.account.pattern.concat(this.formGroup.value.pin);
    let passwordLength = this.data.account.length;
    let includeSpecialCharacter = this.data.account.includeSpecialCharacter;
    let useCustomSpecialCharacter = this.data.account.useCustomSpecialCharacter;
    let customSpecialCharacter = this.data.account.customSpecialCharacter;

    this.resultPassword = this.passwordHashService.createPassword(actualPattern, passwordLength, includeSpecialCharacter, useCustomSpecialCharacter, customSpecialCharacter);
    this.setPassword(this.displayPassword);
  }

  private setPassword(displayActualPassword: boolean) {
    if (this.resultPassword) {
      if (displayActualPassword) {
        this.passwordText = this.resultPassword;
      } else {
        this.passwordText = "*".repeat(this.data.account.length);
      }
    }
  }
}
