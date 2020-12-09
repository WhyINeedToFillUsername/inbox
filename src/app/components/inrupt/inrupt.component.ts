import {Component, OnInit} from '@angular/core';
import {Session, SessionManager} from '@inrupt/solid-client-authn-browser';
import {getFile, getSolidDataset, getThing, getUrlAll, SolidDataset} from '@inrupt/solid-client';
import {InboxDiscoveryService} from "../../services/pleroma/discovery/inbox-discovery.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {LDP} from "@inrupt/vocab-common-rdf";

@Component({
  selector: 'app-inrupt',
  templateUrl: './inrupt.component.html',
  styleUrls: ['./inrupt.component.css']
})
export class InruptComponent implements OnInit {
  webID: string = 'https://docs-example.inrupt.net/profile/card#me';
  fn: string;
  role: string;

  readonly session = new Session();
  readonly sessionManager = new SessionManager();

  constructor(
    private readonly inboxDiscoveryService: InboxDiscoveryService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.handleRedirectAfterLogin();
  }

  // 1a. Start Login Process. Call session.login() function.
  async login() {
    if (!this.session.info.isLoggedIn) {
      await this.session.login({
        oidcIssuer: 'https://inrupt.net',
        redirectUrl: window.location.href,
      });
    }
  }

  // 1b. Login Redirect. Call session.handleIncomingRedirect() function.
  // When redirected after login, finish the process by retrieving session information.
  async handleRedirectAfterLogin() {

    await this.session.handleIncomingRedirect(window.location.href);

    if (this.session.info.isLoggedIn) {
      // Update the page with the status.
      document.getElementById('labelStatus').textContent = 'Your session is logged in.';
      this._snackBar.open('Successfully logged in.', 'Dismiss', {duration: 5000});
    }
  }

  readInbox() {
    this.inboxDiscoveryService.retrieveInboxUrlFromWebId(this.session.info.webId)
      .then(async inboxUrl => {
          const inboxDataSet: SolidDataset = await getSolidDataset(inboxUrl, {fetch: this.session.fetch});
          const inbox = getThing(inboxDataSet, inboxUrl);

          const messages: string[] = getUrlAll(inbox, LDP.contains);
          for (const messageURL of messages) {
            console.log(messageURL);
            const messageFile: Blob = await getFile(messageURL, {fetch: this.session.fetch});
            messageFile.text().then(text => console.log(text))
            // const messageDataSet: SolidDataset = await getSolidDataset(messageURL, {fetch: this.session.fetch});
            // const messageThing = getThing(messageDataSet, messageURL);
            // console.log(messageThing)
          }
        }
      );
  }

  showSession() {
    this.sessionManager.getSession(this.session.info.sessionId).then(value =>
      this._snackBar.open(JSON.stringify(value.info.isLoggedIn), 'Dismiss'),
      error => this._snackBar.open(JSON.stringify(error), 'Dismiss'),
    )
    // this._snackBar.open(JSON.stringify(this.session.info), 'Dismiss');
  }
}
