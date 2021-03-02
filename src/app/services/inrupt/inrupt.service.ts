import {Injectable} from '@angular/core';
import {Session} from "@inrupt/solid-client-authn-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  getContainedResourceUrlAll,
  getDatetime,
  getFile,
  getSolidDataset,
  getStringByLocaleAll,
  getStringNoLocaleAll,
  getStringWithLocale,
  getThing,
  getUrlAll,
  Thing,
  UrlString
} from "@inrupt/solid-client";
import {InboxMessage} from "../../model/inbox.message";
import {DCTERMS, FOAF} from "@inrupt/vocab-common-rdf";
import {Inbox} from "../../model/inbox";
import {CommonHelper} from "../../helpers/common.helper";
import {InboxDiscoveryService} from "../discovery/inbox-discovery.service";
import {Observable} from "rxjs";
import {shareReplay} from "rxjs/operators";
import {ContactInbox} from "../../model/contact.inbox";
import {InruptStaticService} from "./inrupt.static.service";

@Injectable({
  providedIn: 'root'
})
export class InruptService {

  readonly session = new Session();
  inboxes$: Observable<Inbox[]>;
  allMessages$: Observable<InboxMessage[]>;

  constructor(private readonly _snackBar: MatSnackBar) {

    this.inboxes$ = this._getObservableInboxes$();
    this.reloadAllMessages();
  }

  reloadAllMessages() {
    this.allMessages$ = this._getObservableMessages$();
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
        this._snackBar.open("Logged out!", "Dismiss");
        this.inboxes$ = null;
        this.allMessages$ = null;
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
          promises.push(this._loadMessage(inboxDataSet, inbox, inboxMessageUrl).then(message => {
            messagesForTable.push(message)
          }));
        }
        Promise.all(promises).then(() => resolve(InruptStaticService.sortMessagesByDateDesc(messagesForTable)));
      } catch (err) {
        reject(err)
      }
    });
  }

  async getProfileContactInboxes(): Promise<ContactInbox[]> {
    const webId = this.getSessionWebId();
    const profileDataSet = await getSolidDataset(webId, {fetch: this.session.fetch});
    const profile = getThing(profileDataSet, webId);

    const webIds = getUrlAll(profile, FOAF.knows);
    return await InruptStaticService.prepareContacts(webIds);
  }

  getLoggedInUserName(): Promise<string> {
    const webId = this.getSessionWebId();
    return InruptStaticService.getProfileName(webId);
  }

  loadMessage(inbox: Inbox, messageUrl: string): Promise<InboxMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        const inboxDataSet = await getSolidDataset(inbox.url, {fetch: this.session.fetch});
        this._loadMessage(inboxDataSet, inbox, messageUrl).then(message => {
          resolve(message);
        });
      } catch (err) {
        reject(err)
      }
    });
  }

  _loadMessage(inboxDataSet, inbox: Inbox, messageUrl: string): Promise<InboxMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        const inboxMessage: Thing = getThing(inboxDataSet, messageUrl)
        const created: Date = getDatetime(inboxMessage, DCTERMS.modified);
        const messageFile = await getFile(messageUrl, {fetch: this.session.fetch});

        messageFile.text().then(async text => {
          let message = new InboxMessage();
          message.url = messageUrl;
          message.inbox = inbox;
          message.content = text;
          message.type = messageFile.type;
          message.created = created;

          message = await InruptStaticService.parseActivityStreamsMessage(message);

          resolve(message);
        });
      } catch (err) {
        reject(err)
      }
    });
  }

  private async _prepareInboxes(inboxUrls: string[]): Promise<Inbox[]> {
    let inboxes = [];
    for (const inboxUrl of inboxUrls) {
      let inbox = await this.prepareInbox(inboxUrl);
      inboxes.push(inbox);
    }
    return inboxes;
  }

  async prepareInbox(inboxUrl) {
    let inbox = new Inbox();
    inbox.url = inboxUrl;
    inbox.name = await this.getInboxName(inboxUrl);
    inbox.style = CommonHelper.getStyle(inboxUrl);
    return inbox;
  }

  getInboxName(inboxUrl): Promise<string> {
    return this._findInboxName(inboxUrl).then(
      name => name,
      noName => InruptStaticService.getInboxNameFromUrl(inboxUrl)
    )
  }

  private _findInboxName(inboxUrl): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        await getSolidDataset(inboxUrl, {fetch: this.session.fetch}).then(
          inboxDataSet => {
            const inbox = getThing(inboxDataSet, inboxUrl);

            const titleEn = getStringWithLocale(inbox, DCTERMS.title, "en");
            if (titleEn) {
              resolve(titleEn);
              return;
            }

            const titleSomeLocale = getStringByLocaleAll(inbox, DCTERMS.title);
            if (titleSomeLocale && titleSomeLocale[0]) {
              resolve(titleSomeLocale[0]);
              return;
            }

            const titleNoLocale = getStringNoLocaleAll(inbox, DCTERMS.title);
            if (titleNoLocale && titleNoLocale[0]) {
              resolve(titleNoLocale[0]);
              return;
            }

            reject();
            return;
          });
      } catch (error) {
        console.error("Error when finding inbox name: ", error);
        reject();
      }
    });
  }

  private _getObservableInboxes$() {
    return new Observable<Inbox[]>((subscriber) => {
      InboxDiscoveryService.retrieveInboxUrlsFromWebId(this.getSessionWebId()).then(
        inboxUrls => {
          this._prepareInboxes(inboxUrls).then(
            inboxes => {

              subscriber.next(inboxes);
              subscriber.complete();
            }
          )
        }
      );
    }).pipe(shareReplay(1));
  }

  private _getObservableMessages$() {
    return new Observable<InboxMessage[]>((subscriber) => {
      this.inboxes$.subscribe(
        inboxes => {
          let promises = [];
          let allMessages = [];

          for (const inbox of inboxes) {
            promises.push(this.loadMessagesOfInbox(inbox).then(messages => {allMessages = allMessages.concat(messages);}));
          }

          Promise.all(promises).then(() => {
            subscriber.next(InruptStaticService.sortMessagesByDateDesc(allMessages));
            subscriber.complete();
          });

        });
    }).pipe(shareReplay(1));
  }
}
