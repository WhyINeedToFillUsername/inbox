import {Injectable} from '@angular/core';
import {Session} from "@inrupt/solid-client-authn-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  getContainedResourceUrlAll,
  getDatetime,
  getFile,
  getSolidDataset,
  getStringByLocaleAll,
  getStringNoLocale,
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
import {MonitorInboxesService} from "../monitor-inboxes/monitor-inboxes.service";
import {CommonHelper} from "../../helpers/common.helper";
import {InboxDiscoveryService} from "../discovery/inbox-discovery.service";
import {Observable} from "rxjs";
import {shareReplay} from "rxjs/operators";
import {Contact} from "../../model/contact";
import {ContactInbox} from "../../model/contact.inbox";

@Injectable({
  providedIn: 'root'
})
export class InruptService {

  readonly session = new Session();
  inboxes$: Observable<Inbox[]>;

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly _monitorService: MonitorInboxesService) {

    this.inboxes$ = this._getObservableInboxes$();
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
              url: inboxMessageUrl, inbox: inbox, content: text, type: messageFile.type, created: created
            })
          }));
        }
        Promise.all(promises).then(() => resolve(InruptService.sortMessagesByDateDesc(messagesForTable)));
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
    return await InruptService._prepareContacts(webIds);
  }

  getLoggedInUserName(): Promise<string> {
    const webId = this.getSessionWebId();
    return InruptService.getProfileName(webId);
  }

  loadMessage(inbox: Inbox, messageUrl: string): Promise<InboxMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        const inboxDataSet = await getSolidDataset(inbox.url, {fetch: this.session.fetch});
        const inboxMessage: Thing = getThing(inboxDataSet, messageUrl)
        const created: Date = getDatetime(inboxMessage, DCTERMS.modified);
        const messageFile = await getFile(messageUrl, {fetch: this.session.fetch});

        messageFile.text().then(text => {
          resolve({
            url: messageUrl, inbox: inbox, content: text, type: messageFile.type, created: created
          });
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
    inbox.isMonitored = this._monitorService.isInboxMonitored(inboxUrl);
    return inbox;
  }

  getInboxName(inboxUrl): Promise<string> {
    return this._findInboxName(inboxUrl).then(
      name => name,
      noName => InruptService.getInboxNameFromUrl(inboxUrl)
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
        console.log("Error when finding inbox name: ", error);
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

  static sortMessagesByDateDesc(messages: InboxMessage[]): InboxMessage[] {
    return messages.sort((a, b) => {
      return b.created.getTime() - a.created.getTime()
    });
  }

  static getInboxNameFromUrl(inboxUrl: string): string {
    const pathname = new URL(inboxUrl).pathname;
    return pathname.replace(/^\//, '').replace(/\/$/, '');
  }

  static async getProfileName(webId): Promise<string> {
    const profileDataSet = await getSolidDataset(webId);
    const profile = getThing(profileDataSet, webId);
    return getStringNoLocale(profile, FOAF.name);
  }

  private static async _prepareContacts(webIds: string[]): Promise<ContactInbox[]> {
    let inboxesWithContactInfo: ContactInbox[] = [];

    for (const webId of webIds) {
      const inboxUrls = await InboxDiscoveryService.retrieveInboxUrlsFromWebId(webId);
      const contactName = await InruptService.getProfileName(webId);
      const contact: Contact = {webId: webId, name: contactName};

      for (const inboxUrl of inboxUrls) {
        inboxesWithContactInfo.push({url: inboxUrl, name: inboxUrl, contact: contact})
      }
    }
    return inboxesWithContactInfo;
  }
}
