import {Component, OnInit} from '@angular/core';
import {getFile, getSolidDataset, getThing, getUrlAll, SolidDataset} from '@inrupt/solid-client';
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {LDP} from "@inrupt/vocab-common-rdf";
import {InruptService} from "../../services/inrupt/inrupt.service";

@Component({
  selector: 'app-inrupt',
  templateUrl: './inrupt.component.html',
  styleUrls: ['./inrupt.component.css']
})
export class InruptComponent implements OnInit {

  constructor(
    readonly inruptService: InruptService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.handleRedirectAfterLogin();
  }

  // 1a. Start Login Process. Call session.login() function.
  async login() {
    if (!this.inruptService.session.info.isLoggedIn) {
      await this.inruptService.session.login({
        oidcIssuer: 'https://inrupt.net',
        redirectUrl: window.location.href,
      });
    }
  }

  // 1b. Login Redirect. Call session.handleIncomingRedirect() function.
  // When redirected after login, finish the process by retrieving session information.
  async handleRedirectAfterLogin() {

    await this.inruptService.session.handleIncomingRedirect(window.location.href);

    if (this.inruptService.session.info.isLoggedIn) {
      // Update the page with the status.
      document.getElementById('labelStatus').textContent = 'Your session is logged in.';
      this._snackBar.open('Successfully logged in.', 'Dismiss', {duration: 5000});
    }
  }

  readInbox() {
    InboxDiscoveryService.retrieveInboxUrlFromWebId(this.inruptService.session.info.webId)
      .then(async inboxUrl => {
        const inboxDataSet: SolidDataset = await getSolidDataset(inboxUrl, {fetch: this.inruptService.session.fetch});
        const inbox = getThing(inboxDataSet, inboxUrl);

          const messages: string[] = getUrlAll(inbox, LDP.contains);
          for (const messageURL of messages) {
            console.log(messageURL);
            const messageFile: Blob = await getFile(messageURL, {fetch: this.inruptService.session.fetch});
            messageFile.text().then(text => console.log(text))
            // const messageDataSet: SolidDataset = await getSolidDataset(messageURL, {fetch: this.session.fetch});
            // const messageThing = getThing(messageDataSet, messageURL);
            // console.log(messageThing)
          }
        }
      );
  }

  showSession() {
    this.inruptService.sessionManager.getSession(this.inruptService.session.info.sessionId).then(value =>
        this._snackBar.open(JSON.stringify(value.info.isLoggedIn), 'Dismiss'),
      error => this._snackBar.open(JSON.stringify(error), 'Dismiss'),
    )
    // this._snackBar.open(JSON.stringify(this.session.info), 'Dismiss');
  }
}
