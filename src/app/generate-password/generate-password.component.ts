import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {AuthService} from "../shared/services/auth.service";
import {AccountService} from "../shared/services/account.service";
import {IsLoadingService} from "@service-work/is-loading";
import {Account} from "../shared/models/dto/account";
import {PasswordHashService} from "../shared/services/password-hash.service";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ManageAccountComponent} from "../manage-account/manage-account.component";

@Component({
  selector: 'app-generate-password',
  templateUrl: './generate-password.component.html',
  styleUrls: ['./generate-password.component.sass']
})
export class GeneratePasswordComponent implements OnInit {
  public formGroup: FormGroup;
  public passwordText: string | undefined;
  public displayPattern: boolean = false;
  public displayPin: boolean = false;
  public displayPassword: boolean = false;
  public isSaveEnabled: boolean;
  public account: Account;
  private resultPassword: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private loadingService: IsLoadingService,
    private dialog: MatDialog,
    private passwordHashService: PasswordHashService,
    private authService: AuthService,
    private accountService: AccountService) {
  }

  public get pattern() {
    return this.formGroup.get('pattern');
  }

  public get length() {
    return this.formGroup.get('length');
  }

  public get pin() {
    return this.formGroup.get('pin');
  }

  public get customSpecialCharacter() {
    return this.formGroup.get('customSpecialCharacter');
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      pattern: ['', Validators.required],
      length: [20, [Validators.required, Validators.min(8), Validators.max(44)]],
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      includeSpecialCharacter: [true],
      useCustomSpecialCharacter: [false],
      customSpecialCharacter: [{
        value: '',
        disabled: true
      }, [Validators.maxLength(1), Validators.pattern('^[!#$()*+-:;<=>?@_{|}~\\[\\]]$')]]
    });

    this.route.queryParams
      .subscribe(params => {
          // @ts-ignore
          this.getAccount(params.accountId);
        }
      );

    this.isSaveEnabled = this.authService.isLoggedIn();
  }

  public includeSpecialCharacterChanged(args: MatSlideToggleChange) {
    this.handleIncludeSpecialCharacterChanged(args.checked);
  }

  public useCustomSpecialCharacterChanged(args: MatSlideToggleChange) {
    this.handleUseCustomSpecialCharacterChanged(args.checked);
  }

  public showPasswordChanged() {
    this.displayPassword = !this.displayPassword;
    this.setPassword(this.displayPassword);
  }

  public onSubmit() {
    if (!this.formGroup.valid)
      return;

    let actualPattern = this.formGroup.value.pattern.concat(this.formGroup.value.pin);
    let passwordLength = this.formGroup.value.length;
    let includeSpecialCharacter = this.formGroup.value.includeSpecialCharacter;
    let useCustomSpecialCharacter = this.formGroup.value.useCustomSpecialCharacter;
    let customSpecialCharacter = this.formGroup.value.customSpecialCharacter;

    this.resultPassword = this.passwordHashService.createPassword(actualPattern, passwordLength, includeSpecialCharacter, useCustomSpecialCharacter, customSpecialCharacter);
    this.setPassword(this.displayPassword);
  }

  public copyPassword() {
    if (this.resultPassword) {
      this.clipboard.copy(this.resultPassword);
      this.snackBar.open('Password copied', 'DISMISS');
    }
  }

  public clear(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.formGroup.reset();

    this.formGroup.setValue({
      pattern: '',
      pin: '',
      length: 20,
      includeSpecialCharacter: true,
      useCustomSpecialCharacter: false,
      customSpecialCharacter: ''
    });

    this.resultPassword = undefined;
    this.passwordText = undefined;

    this.handleIncludeSpecialCharacterChanged(true);
    this.handleUseCustomSpecialCharacterChanged(false);
  }

  public saveAccount() {
    if (this.resultPassword) {
      let account = new Account();
      account.pattern = this.formGroup.value.pattern;
      account.length = this.formGroup.value.length;
      account.includeSpecialCharacter = this.formGroup.value.includeSpecialCharacter;
      account.useCustomSpecialCharacter = this.formGroup.value.useCustomSpecialCharacter;
      account.customSpecialCharacter = this.formGroup.value.customSpecialCharacter ?? '';
      if (this.account) {
        account.id = this.account.id;
        account.name = this.account.name;
        account.category = this.account.category;
        account.username = this.account.username;
      }

      const dialogRef = this.dialog.open(ManageAccountComponent, {
        data: {account: account},
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        }
      });
    }
  }

  private handleIncludeSpecialCharacterChanged(value: boolean) {
    if (value) {
      this.formGroup.get('useCustomSpecialCharacter')?.enable();
    } else {
      this.formGroup.patchValue({useCustomSpecialCharacter: false, customSpecialCharacter: ''});
      this.formGroup.get('useCustomSpecialCharacter')?.disable();
      this.formGroup.get('customSpecialCharacter')?.disable();
      this.formGroup.get('customSpecialCharacter')?.removeValidators(Validators.required);
      this.formGroup.get('customSpecialCharacter')?.updateValueAndValidity();
    }
  }

  private handleUseCustomSpecialCharacterChanged(value: boolean) {
    if (value) {
      this.formGroup.get('customSpecialCharacter')?.enable();
      this.formGroup.get('customSpecialCharacter')?.addValidators(Validators.required);
    } else {
      this.formGroup.patchValue({customSpecialCharacter: ''});
      this.formGroup.get('customSpecialCharacter')?.removeValidators(Validators.required);
      this.formGroup.get('customSpecialCharacter')?.disable();
    }
    this.formGroup.get('customSpecialCharacter')?.updateValueAndValidity();
  }

  private setPassword(displayActualPassword: boolean) {
    if (this.resultPassword) {
      if (displayActualPassword) {
        this.passwordText = this.resultPassword;
      } else {
        this.passwordText = "*".repeat(this.formGroup.value.length);
      }
    }
  }

  private async getAccount(accountId: string) {
    if (accountId) {
      let resp = await this.loadingService.add(this.accountService.get(accountId));
      if (resp.isSuccess) {
        this.account = resp.result;

        this.formGroup.setValue({
          pattern: this.account.pattern,
          pin: '',
          length: this.account.length,
          includeSpecialCharacter: this.account.includeSpecialCharacter,
          useCustomSpecialCharacter: this.account.useCustomSpecialCharacter,
          customSpecialCharacter: this.account.customSpecialCharacter ?? ''
        });

        this.handleIncludeSpecialCharacterChanged(this.account.includeSpecialCharacter);
        this.handleUseCustomSpecialCharacterChanged(this.account.useCustomSpecialCharacter);
      }
    }
  }
}
