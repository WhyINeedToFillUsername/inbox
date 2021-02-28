import {InboxMessage} from "../../model/inbox.message";
import {getSolidDataset, getStringNoLocale, getThing, getUrl} from "@inrupt/solid-client";
import {FOAF, VCARD} from "@inrupt/vocab-common-rdf";
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

  static async getProfilePicture(webId): Promise<string> {
    const profileDataSet = await getSolidDataset(webId);
    const profile = getThing(profileDataSet, webId);
    return getUrl(profile, VCARD.hasPhoto);
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

  static shouldParseJson(type: string): boolean {
    const typesToParse = ['application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
      'application/activity+json', 'application/json', 'application/ld+json']

    return typesToParse.includes(type);
  }

  static parseActivityPubMessage(message: InboxMessage): InboxMessage {
    if (InruptStaticService.shouldParseJson(message.type)) {
      try {
        message.jsonFields = JSON.parse(message.content);

        if (message.jsonFields?.object?.content) message.content = message.jsonFields.object.content;
        else if (message.jsonFields?.content) message.content = message.jsonFields.content;

        message.name = message.jsonFields?.name;
        message.actor = message.jsonFields?.actor;

        return message;

      } catch (ignore) {}
    }
    return message;
  }
}
