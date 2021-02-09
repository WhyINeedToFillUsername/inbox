import {Injectable} from '@angular/core';
import {getSolidDataset, getThing, getUrl, getUrlAll, SolidDataset} from "@inrupt/solid-client";
import {LDP} from "@inrupt/vocab-common-rdf";

@Injectable({
  providedIn: 'root'
})
export class InboxDiscoveryService {

  static async discoverInboxUrlFromTarget(webID: string): Promise<string> {
    // TODO implement other ways of discovering inbox
    return InboxDiscoveryService.retrieveInboxUrlFromWebId(webID);
  }

  static async retrieveInboxUrlFromWebId(webID: string): Promise<string> {
    const myDataset: SolidDataset = await getSolidDataset(webID);
    const profile = getThing(myDataset, webID);
    return getUrl(profile, LDP.inbox);
  }

  static async retrieveInboxUrlsFromWebId(webID: string): Promise<string[]> {
    const myDataset: SolidDataset = await getSolidDataset(webID);
    const profile = getThing(myDataset, webID);
    return getUrlAll(profile, LDP.inbox);
  }
}
