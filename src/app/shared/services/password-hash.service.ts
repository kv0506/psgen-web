import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class PasswordHashService {
  private characters: string = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  constructor() { }

  public createPassword(pattern: string, length: number, includeSpecialCharacter: boolean, useCustomSpecialCharacter: boolean, customSpecialCharacter: string): string {
    let randomPassword = this.createHash(pattern);
    let password = '';

    if (!includeSpecialCharacter) {
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

      if (!hasSpecialCharacter) {
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
