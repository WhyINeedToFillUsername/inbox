import {Injectable} from '@angular/core';
import {Session} from "@inrupt/solid-client-authn-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  getContainedResourceUrlAll,
  getDatetime,
  getFile,
  getSolidDataset,
  getThing,
  SolidDataset,
  Thing,
  UrlString
} from "@inrupt/solid-client";
import {InboxMessage} from "../../components/inrupt/model/inbox.message";
import {DCTERMS} from "@inrupt/vocab-common-rdf";
import {WithServerResourceInfo} from "@inrupt/solid-client/src/interfaces";

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
        const inboxDataSet: SolidDataset & WithServerResourceInfo = await getSolidDataset(inboxUrl, {fetch: this.session.fetch});
        const inboxMessagesUrls: UrlString[] = getContainedResourceUrlAll(inboxDataSet);

        let messagesForTable = new Array<InboxMessage>();

        for (const inboxMessageUrl of inboxMessagesUrls) {
          const inboxMessage: Thing = getThing(inboxDataSet, inboxMessageUrl)
          const created: Date = getDatetime(inboxMessage, DCTERMS.modified);
          const messageFile: Blob = await getFile(inboxMessageUrl, {fetch: this.session.fetch});

          messageFile.text().then(text => {
            messagesForTable.push({
              url: inboxMessageUrl, content: text, type: messageFile.type, created: created
            })
          });
        }
        resolve(messagesForTable);
      } catch (err) {
        reject(err)
      }
    });
  }

  static sortMessagesByDateDesc(messages: InboxMessage[]): InboxMessage[] {
    return messages.sort((a, b) => {
      return b.created.getTime() - a.created.getTime()
    });
  }
}
