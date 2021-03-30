import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from "@angular/router";
import {InruptService} from "../inrupt/inrupt.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private readonly _inruptService: InruptService,
              private readonly _router: Router) {
  }

  canActivate(): UrlTree | boolean {
    if (this._inruptService.isLoggedIn()) {
      return true;
    } else {
      return this._router.parseUrl('/login');
    }
  }
}
