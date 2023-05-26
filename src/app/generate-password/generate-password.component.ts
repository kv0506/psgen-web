import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {AuthService} from "../shared/services/auth.service";
import {AccountService} from "../shared/services/account.service";
import {CreateAccount, UpdateAccount} from "../shared/models/request/account";
import {IsLoadingService} from "@service-work/is-loading";
import {AlertService} from "../shared/services/alert.service";
import {Account} from "../shared/models/dto/account";
import {PasswordHashService} from "../shared/services/password-hash.service";
import {ActivatedRoute} from "@angular/router";

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

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private clipboard: Clipboard, private loadingService: IsLoadingService,
              private passwordHashService: PasswordHashService, private authService: AuthService, private accountService: AccountService, private alertService: AlertService) {
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
      }, [Validators.maxLength(1), Validators.pattern('^[!#$()*+-:;<=>?@_{|}~\\[\\]]$')]],
      accountName: [''],
      accountCategory: ['']
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
      customSpecialCharacter: '',
      accountName: '',
      accountCategory: ''
    });

    this.resultPassword = undefined;
    this.passwordText = undefined;

    this.handleIncludeSpecialCharacterChanged(true);
    this.handleUseCustomSpecialCharacterChanged(false);
  }

  public canSave(): boolean {
    return this.formGroup.valid && this.formGroup.value.accountName;
  }

  public saveAccount() {
    if (this.canSave()) {
      if (this.account) {
        this.updateAccount();
      } else {
        this.createAccount();
      }
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
          customSpecialCharacter: this.account.customSpecialCharacter,
          accountName: this.account.name,
          accountCategory: this.account.category
        });

        // uncomment if required
        // this.handleIncludeSpecialCharacterChanged(this.account.includeSpecialCharacter);
        // this.handleUseCustomSpecialCharacterChanged(this.account.useCustomSpecialCharacter);
      }
    }
  }

  private async createAccount() {
    let req = new CreateAccount();
    req.name = this.formGroup.value.accountName;
    req.category = this.formGroup.value.accountCategory;
    req.pattern = this.formGroup.value.pattern;
    req.length = this.formGroup.value.length;
    req.includeSpecialCharacter = this.formGroup.value.includeSpecialCharacter;
    req.useCustomSpecialCharacter = this.formGroup.value.useCustomSpecialCharacter;
    req.customSpecialCharacter = this.formGroup.value.customSpecialCharacter;

    let resp = await this.loadingService.add(this.accountService.create(req));
    if (resp.isSuccess) {
      this.alertService.showError(`Account ${req.name} is saved successfully`);
    }
  }

  private async updateAccount() {
    if (this.account) {
      let req = new UpdateAccount();
      req.id = this.account.id;
      req.name = this.formGroup.value.accountName;
      req.category = this.formGroup.value.accountCategory;
      req.pattern = this.formGroup.value.pattern;
      req.length = this.formGroup.value.length;
      req.includeSpecialCharacter = this.formGroup.value.includeSpecialCharacter;
      req.useCustomSpecialCharacter = this.formGroup.value.useCustomSpecialCharacter;
      req.customSpecialCharacter = this.formGroup.value.customSpecialCharacter;

      let resp = await this.loadingService.add(this.accountService.update(req));
      if (resp.isSuccess) {
        this.alertService.showError(`Account ${req.name} is updated successfully`);
      }
    }
  }
}
