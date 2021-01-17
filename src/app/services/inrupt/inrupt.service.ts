import {Injectable} from '@angular/core';
import {Session} from "@inrupt/solid-client-authn-browser";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class InruptService {

  readonly session = new Session();

  constructor(private _snackBar: MatSnackBar) {
  }

  logout() {
    this.session.logout()
      .then(() => this._snackBar.open("Logged out!", "Dismiss"));
  }
}
