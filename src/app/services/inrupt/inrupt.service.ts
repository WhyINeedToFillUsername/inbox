import {Injectable} from '@angular/core';
import {Session, SessionManager} from "@inrupt/solid-client-authn-browser";

@Injectable({
  providedIn: 'root'
})
export class InruptService {

  readonly session = new Session();
  readonly sessionManager = new SessionManager();

  constructor() {
  }
}
