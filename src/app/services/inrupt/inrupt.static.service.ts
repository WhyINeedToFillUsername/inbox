import {InboxMessage} from "../../model/inbox.message";
import {getSolidDataset, getStringNoLocale, getThing} from "@inrupt/solid-client";
import {FOAF} from "@inrupt/vocab-common-rdf";
import {ContactInbox} from "../../model/contact.inbox";
import {InboxDiscoveryService} from "../discovery/inbox-discovery.service";
import {Contact} from "../../model/contact";

export class InruptStaticService {

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

  static async prepareContacts(webIds: string[]): Promise<ContactInbox[]> {
    let inboxesWithContactInfo: ContactInbox[] = [];

    for (const webId of webIds) {
      const inboxUrls = await InboxDiscoveryService.retrieveInboxUrlsFromWebId(webId);
      const contactName = await InruptStaticService.getProfileName(webId);
      const contact: Contact = {webId: webId, name: contactName};

      for (const inboxUrl of inboxUrls) {
        inboxesWithContactInfo.push({url: inboxUrl, name: inboxUrl, contact: contact})
      }
    }
    return inboxesWithContactInfo;
  }
}
