import {Injectable} from '@angular/core';
import {Session} from "@inrupt/solid-client-authn-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {getFile, getSolidDataset, getThing, getUrlAll, SolidDataset} from "@inrupt/solid-client";
import {InboxMessage} from "../../components/inrupt/model/inbox.message";
import {LDP} from "@inrupt/vocab-common-rdf";

@Injectable({
  providedIn: 'root'
})
export class InruptService {

  readonly session = new Session();

  constructor(private _snackBar: MatSnackBar) {
  }

  logout() {
    this.session.logout()
      .then(() => {this._snackBar.open("Logged out!", "Dismiss")});
  }

  getWebId(): string {
    return this.session.info.webId;
  }

  getMessagesFromInbox(inboxUrl: string): Promise<InboxMessage[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const inboxDataSet: SolidDataset = await getSolidDataset(inboxUrl, {fetch: this.session.fetch});
        const inbox = getThing(inboxDataSet, inboxUrl);

        let messagesForTable = new Array<InboxMessage>();

        const messages: string[] = getUrlAll(inbox, LDP.contains);
        for (const messageURL of messages) {
          const messageFile: Blob = await getFile(messageURL, {fetch: this.session.fetch});
          messageFile.text().then(text => {
            messagesForTable.push({url: messageURL, content: text, type: messageFile.type})
          })
        }
        resolve(messagesForTable);
      } catch (err) {
        reject(err)
      }
    });

  }
}
