import {Component, OnInit} from '@angular/core';
import {InruptService} from "../../services/inrupt/inrupt.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  spinner: boolean = false;

  oidcIssuers = [
    {"name": "Inrupt", url: 'https://inrupt.net'},
    {"name": "Solid", url: 'https://solidcommunity.net'}
  ];
  selectedOidcIssuer = this.oidcIssuers[0].url;

  constructor(private readonly _inruptService: InruptService,
              private readonly _router: Router) {
  }

  ngOnInit(): void {
    this.handleRedirectAfterLogin();
  }

  login() {
    this.spinner = true;
    this._inruptService.login(this.selectedOidcIssuer);
  }

  handleRedirectAfterLogin() {
    this.spinner = true;
    this._inruptService.session.handleIncomingRedirect(window.location.href)
      .then(sessionInfo => {
        if (sessionInfo.isLoggedIn) {
          this._router.navigate(['/incoming']);
        } else {
          this.spinner = false;
        }
      });
  }

}
