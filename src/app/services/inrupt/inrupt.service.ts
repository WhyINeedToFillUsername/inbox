import {Injectable} from '@angular/core';
import {Session} from "@inrupt/solid-client-authn-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  getContainedResourceUrlAll,
  getDatetime,
  getFile,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrlAll,
  Thing,
  UrlString
} from "@inrupt/solid-client";
import {InboxMessage} from "../../model/inbox.message";
import {DCTERMS, FOAF} from "@inrupt/vocab-common-rdf";
import {Inbox} from "../../model/inbox";
import {MonitorInboxesService} from "../monitor-inboxes/monitor-inboxes.service";
import {CommonHelper} from "../../helpers/common.helper";
import {InboxDiscoveryService} from "../discovery/inbox-discovery.service";

@Injectable({
  providedIn: 'root'
})
export class InruptService {

  readonly session = new Session();
  inboxes: Inbox[];

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly _monitorService: MonitorInboxesService) {
  }

  login(selectedOidcIssuer: string) {
    if (!this.session.info.isLoggedIn) {
      this.session.login({
        oidcIssuer: selectedOidcIssuer,
        redirectUrl: window.location.href,
      });
    }
  }

  logout() {
    this.session.logout()
      .then(() => {
        this._snackBar.open("Logged out!", "Dismiss")
      });
  }

  isLoggedIn(): boolean {
    return this.session.info.isLoggedIn;
  }

  getSessionWebId(): string {
    return this.session.info.webId;
  }

  loadMessagesOfInbox(inbox: Inbox): Promise<InboxMessage[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const inboxDataSet = await getSolidDataset(inbox.url, {fetch: this.session.fetch});
        const inboxMessagesUrls: UrlString[] = getContainedResourceUrlAll(inboxDataSet);

        let messagesForTable: InboxMessage[] = [];
        let promises = [];

        for (const inboxMessageUrl of inboxMessagesUrls) {
          const inboxMessage: Thing = getThing(inboxDataSet, inboxMessageUrl)
          const created: Date = getDatetime(inboxMessage, DCTERMS.modified);
          const messageFile = await getFile(inboxMessageUrl, {fetch: this.session.fetch});

          promises.push(messageFile.text().then(text => {
            messagesForTable.push({
              url: inboxMessageUrl, inboxId: inbox.id, content: text, type: messageFile.type, created: created
            })
          }));
        }
        Promise.all(promises).then(() => resolve(InruptService.sortMessagesByDateDesc(messagesForTable)));
      } catch (err) {
        reject(err)
      }
    });
  }

  getInboxById(inboxId: string): Promise<Inbox> {
    return InboxDiscoveryService.retrieveInboxUrlsFromWebId(this.session.info.webId)
      .then(inboxUrls => {
        this.inboxes = this.prepareInboxes(inboxUrls);
        return this.inboxes.find(inbox => inbox.id === inboxId);
      });
  }

  async getFriendsFromWebId(webId: string) {
    const profileDataSet = await getSolidDataset(webId, {fetch: this.session.fetch});
    const profile = getThing(profileDataSet, webId);

    const friends = getUrlAll(profile, FOAF.knows);

    return friends;
  }

  getLoggedInUserName(): Promise<string> {
    const webId = this.getSessionWebId();
    return getSolidDataset(webId, {fetch: this.session.fetch}).then(
      profileDataSet => {

        const profile = getThing(profileDataSet, webId);
        const name = getStringNoLocale(profile, FOAF.name);

        return name;
      }
    );
  }

  loadMessage(inboxId: string, messageUrl: string): Promise<InboxMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        const inbox = await this.getInboxById(inboxId);
        const inboxDataSet = await getSolidDataset(inbox.url, {fetch: this.session.fetch});
        const inboxMessage: Thing = getThing(inboxDataSet, messageUrl)
        const created: Date = getDatetime(inboxMessage, DCTERMS.modified);
        const messageFile = await getFile(messageUrl, {fetch: this.session.fetch});

        messageFile.text().then(text => {
          resolve({
            url: messageUrl, inboxId: inboxId, content: text, type: messageFile.type, created: created
          });
        });
      } catch (err) {
        reject(err)
      }
    });
  }

  prepareInboxes(inboxUrls: string[]): Inbox[] {
    this.inboxes = [];
    for (const inboxUrl of inboxUrls) {
      let inbox = this.prepareInbox(inboxUrl);
      this.inboxes.push(inbox);
    }
    return this.inboxes;
  }

  prepareInbox(inboxUrl) {
    let inbox = new Inbox();
    inbox.url = inboxUrl;
    inbox.id = CommonHelper.hash(inboxUrl);
    inbox.isMonitored = this._monitorService.isInboxMonitored(inboxUrl);
    return inbox;
  }

  static sortMessagesByDateDesc(messages: InboxMessage[]): InboxMessage[] {
    return messages.sort((a, b) => {
      return b.created.getTime() - a.created.getTime()
    });
  }
}
