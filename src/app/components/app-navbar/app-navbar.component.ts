import {Component, OnInit} from '@angular/core';
import {InruptService} from "../../services/inrupt/inrupt.service";
import {InruptStaticService} from "../../services/inrupt/inrupt.static.service";
import {MonitorInboxesService} from "../../services/monitor-inboxes/monitor-inboxes.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent implements OnInit {

  username: string;
  webId: string;
  userLoggedIn;
  photoSrc: string = "assets/images/avatar.png";

  constructor(private readonly _inruptService: InruptService,
              private readonly _monitoringService: MonitorInboxesService) {
  }

  ngOnInit(): void {
    this.userLoggedIn = this._inruptService.isLoggedIn();
    this.onLogin();
  }

  onLogin() {
    this._inruptService.session.addListener('login', () => {
      this.userLoggedIn = true;
      this.webId = this._inruptService.session.info.webId;
      this._inruptService.getLoggedInUserName().then(username => {this.username = username;});

      InruptStaticService.getProfilePicture(this.webId).then(photoPath => {
        if (photoPath) this.photoSrc = photoPath;
      });

      this._monitoringService.startMonitoringAll();
    });
  }

  logout() {
    this._inruptService.logout();
    this._monitoringService.stopMonitoringAllInboxes();
    window.location.reload();
  }
}
