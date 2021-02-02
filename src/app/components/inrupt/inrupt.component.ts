import {Component, OnInit} from '@angular/core';
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {InruptService} from "../../services/inrupt/inrupt.service";
import {InboxMessage} from "./model/inbox.message";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-inrupt',
  templateUrl: './inrupt.component.html',
  styleUrls: ['./inrupt.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InruptComponent implements OnInit {
  spinner: boolean = false;
  working: boolean = false;
  inboxUrl: string;
  webId: string;
  name: string;
  oidcIssuer: string = 'https://inrupt.net'; // 'https://solidcommunity.net' or 'https://inrupt.net'

  messages: InboxMessage[];
  columnsToDisplay = ['created', 'url', 'type'];
  expandedElement: InboxMessage | null;

  friends: string[];

  constructor(
    readonly inruptService: InruptService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.handleRedirectAfterLogin();
  }

  async login() {
    if (!this.inruptService.session.info.isLoggedIn) {
      await this.inruptService.session.login({
        oidcIssuer: this.oidcIssuer,
        redirectUrl: window.location.href,
      });
    }
  }

  logout() {
    this.inruptService.logout();
    window.location.reload();
  }

  onLogin() {
    this.webId = this.inruptService.getSessionWebId()
    this.inruptService.getLoggedInUserName().then(name => {this.name = name});

    this._snackBar.open('Successfully logged in.', 'Dismiss');
    this.spinner = false;
    this.readInbox();
  }

  async handleRedirectAfterLogin() {
    this.spinner = true;
    this.inruptService.session.handleIncomingRedirect(window.location.href)
      .then(sessionInfo => {
        if (sessionInfo.isLoggedIn) {
          this.onLogin();
        } else this.spinner = false;
      });
  }

  readInbox() {
    if (this.webId) {
      this.working = true;
      InboxDiscoveryService.retrieveInboxUrlFromWebId(this.webId)
        .then(inboxUrl => {

          this.inruptService.getMessagesFromInbox(inboxUrl)
            .then(messages => {this.messages = InruptService.sortMessagesByDateDesc(messages);})
            .catch(error => {this._snackBar.open('Error retrieving messages from from inbox "' + inboxUrl + '":' + error, 'Dismiss');})
            .finally(() => this.working = false);

        })
        .catch(error => {
            this._snackBar.open('Error retrieving inbox from webId: ' + error, 'Dismiss');
            this.working = false;
          })
    } else {
      this.login();
    }
  }

  async readFriends() {
    if (!this.webId) this.login();
    this.working = true;

    this.inruptService.getFriendsFromWebId(this.webId).then(
      friends => {
        this.friends = [];
        friends.forEach(friend => {
          this.friends.push(friend);
        })

        if (this.friends.length === 0)
          this.friends.push("(no friends in your profile)");

        this.working = false;
      }
    )
  }
}
