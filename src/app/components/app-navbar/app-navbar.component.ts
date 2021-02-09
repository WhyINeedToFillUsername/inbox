import {Component, OnInit} from '@angular/core';
import {InruptService} from "../../services/inrupt/inrupt.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent implements OnInit {

  username: string;
  webId: string;
  userLoggedIn;

  constructor(private readonly _inruptService: InruptService) {
  }

  ngOnInit(): void {
    this.userLoggedIn = this._inruptService.isLoggedIn();
    this.onLogin();
  }

  onLogin() {
    this._inruptService.session.addListener('login', () => {
      this.userLoggedIn = true;
      this.webId = this._inruptService.session.info.webId;
      this._inruptService.getLoggedInUserName().then(username => {
        this.username = username;
      })
    });
  }

  logout() {
    this._inruptService.logout();
    window.location.reload();
  }
}
