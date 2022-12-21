import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Clipboard} from '@angular/cdk/clipboard';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  private characters: string = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private resultPassword: string | undefined;

  public formGroup: FormGroup;
  public displayPassword: string | undefined;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private clipboard: Clipboard) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      pattern: ['', Validators.required],
      length: [8, [Validators.required, Validators.min(8), Validators.max(44)]],
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      includeSpecialCharacter: [true],
      useCustomSpecialCharacter: [false],
      customSpecialCharacter: [{value: '', disabled: true}, [Validators.min(1), Validators.max(1)]],
      showPassword: [false]
    });
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

  public includeSpecialCharacterChanged(args: MatCheckboxChange) {
    if (args.checked) {
      this.formGroup.get('useCustomSpecialCharacter')?.enable();
    } else {
      this.formGroup.patchValue({useCustomSpecialCharacter: false});
      this.formGroup.get('useCustomSpecialCharacter')?.disable();
      this.formGroup.get('customSpecialCharacter')?.disable();
    }
  }

  public useCustomSpecialCharacterChanged(args: MatCheckboxChange) {
    if (args.checked) {
      this.formGroup.get('customSpecialCharacter')?.enable();
    } else {
      this.formGroup.get('customSpecialCharacter')?.disable();
    }
  }

  public showPasswordChanged(args: MatCheckboxChange) {
    this.setPassword(args.checked);
  }

  public onSubmit() {
    if (!this.formGroup.valid)
      return;

    let actualPattern = this.formGroup.value.pattern.concat(this.formGroup.value.pin);
    let passwordLength = this.formGroup.value.length;
    let includeSpecialCharacter = this.formGroup.value.includeSpecialCharacter;
    let useCustomSpecialCharacter = this.formGroup.value.useCustomSpecialCharacter;
    let customSpecialCharacter = this.formGroup.value.customSpecialCharacter;

    this.resultPassword = this.createPassword(actualPattern, passwordLength, includeSpecialCharacter, useCustomSpecialCharacter, customSpecialCharacter);
    this.setPassword(this.formGroup.value.showPassword);
  }

  public copyPassword() {
    if (this.resultPassword) {
      this.clipboard.copy(this.resultPassword);
      this.snackBar.open('Password copied', 'DISMISS');
    }
  }

  public clear() {
    this.formGroup.setValue({
      pattern: '',
      pin: '',
      length: 8,
      includeSpecialCharacter: true,
      useCustomSpecialCharacter: false,
      customSpecialCharacter: '',
      showPassword: false
    });

    this.resultPassword = undefined;
    this.displayPassword = undefined;
  }

  private setPassword(displayActualPassword: boolean) {
    if (this.resultPassword) {
      if (displayActualPassword) {
        this.displayPassword = this.resultPassword;
      } else {
        this.displayPassword = "*".repeat(this.formGroup.value.length);
      }
    }
  }

  private createPassword(pattern: string, length: number, includeSpecialCharacter: boolean, useCustomSpecialCharacter: boolean, customSpecialCharacter: string): string {
    let randomPassword = this.createHash(pattern);
    let password = '';

    if (includeSpecialCharacter === false) {
      for (let i = 0; i < length; i++) {
        if (this.characters.indexOf(randomPassword[i]) > -1) {
          password = password.concat(randomPassword[i]);
        } else {
          password = password.concat(this.characters[i]);
        }
      }
      return password;
    } else {
      let hasSpecialCharacter = false;
      for (let i = 0; i < length; i++) {
        if (this.characters.indexOf(randomPassword[i]) > -1) {
          password = password.concat(randomPassword[i]);
        } else {
          hasSpecialCharacter = true;
          password = useCustomSpecialCharacter ? password.concat(customSpecialCharacter[0]) : password.concat(randomPassword[i]);
        }
      }

      if (hasSpecialCharacter === false) {
        let passwordPart = password.substring(0, length - 1);
        return useCustomSpecialCharacter ? passwordPart.concat(customSpecialCharacter[0]) : passwordPart.concat('#');
      }

      return password;
    }
  }

  private createHash(content: string): string {
    return CryptoJS.SHA256(content).toString(CryptoJS.enc.Base64);
  }
}