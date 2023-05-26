import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private _snackBar: MatSnackBar) {
  }

  public showError(message: string) {
    this._snackBar.open(message, 'Dismiss');
  }
}
