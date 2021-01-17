import {Component, OnInit} from '@angular/core';
import {getFile, getSolidDataset, getThing, getUrlAll, SolidDataset} from '@inrupt/solid-client';
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {LDP} from "@inrupt/vocab-common-rdf";
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
  working: boolean = false;
  inboxUrl: string;

  messages: InboxMessage[];
  columnsToDisplay = ['url', 'type'];
  expandedElement: InboxMessage | null;

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
    this.inruptService.session.onLogin(() => {
      this._snackBar.open('Successfully logged in.', 'Dismiss');
    });
    await this.inruptService.session.handleIncomingRedirect(window.location.href);
  }

  readInbox() {
    this.working = true;
    InboxDiscoveryService.retrieveInboxUrlFromWebId(this.inruptService.session.info.webId)
      .then(async inboxUrl => {
          const inboxDataSet: SolidDataset = await getSolidDataset(inboxUrl, {fetch: this.inruptService.session.fetch});
          const inbox = getThing(inboxDataSet, inboxUrl);

          this.inboxUrl = inboxUrl;
          let messagesForTable = new Array<InboxMessage>();

          const messages: string[] = getUrlAll(inbox, LDP.contains);
          for (const messageURL of messages) {
            const messageFile: Blob = await getFile(messageURL, {fetch: this.inruptService.session.fetch});
            messageFile.text().then(text => {
              messagesForTable.push({url: messageURL, content: text, type: messageFile.type})
            })
          }
          this.messages = messagesForTable;
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
