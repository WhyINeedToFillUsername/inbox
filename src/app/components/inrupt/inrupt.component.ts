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
  working: boolean = false;

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
        oidcIssuer: 'https://inrupt.net',
        redirectUrl: window.location.href,
      });
    }
  }

  logout() {
    this.inruptService.logout();
    window.location.reload();
  }

  async handleRedirectAfterLogin() {
    this.inruptService.session.onLogin(() => this._snackBar.open('Successfully logged in.', 'Dismiss'));
    await this.inruptService.session.handleIncomingRedirect(window.location.href);
  }

  readInbox() {
    this.working = true;
    InboxDiscoveryService.retrieveInboxUrlFromWebId(this.inruptService.session.info.webId)
      .then(async inboxUrl => {
          const inboxDataSet: SolidDataset = await getSolidDataset(inboxUrl, {fetch: this.inruptService.session.fetch});
          const inbox = getThing(inboxDataSet, inboxUrl);

          console.log(inbox);

          const messages: string[] = getUrlAll(inbox, LDP.contains);
          for (const messageURL of messages) {
            console.log(messageURL);
            const messageFile: Blob = await getFile(messageURL, {fetch: this.inruptService.session.fetch});
            messageFile.text().then(text => console.log(text))
            // const messageDataSet: SolidDataset = await getSolidDataset(messageURL, {fetch: this.session.fetch});
            // const messageThing = getThing(messageDataSet, messageURL);
            // console.log(messageThing)
          }
          // this.working = false;
        },
        error =>
          this._snackBar.open('Error retrieving inbox from webId: ' + error, 'Dismiss')
      )
      .catch(error =>
        this._snackBar.open('Error retrieving inbox from webId: ' + error, 'Dismiss')
      )
      .finally(() => this.working = false)
  }
}
