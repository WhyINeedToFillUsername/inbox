import {Injectable} from '@angular/core';
import {getSolidDataset, getThing, getUrl, SolidDataset} from "@inrupt/solid-client";
import {LDP} from "@inrupt/vocab-common-rdf";

@Injectable({
  providedIn: 'root'
})
export class InboxDiscoveryService {

  constructor() {
  }

  async retrieveInboxUrlFromWebId(webID: string): Promise<string> {
    const myDataset: SolidDataset = await getSolidDataset(webID);
    const profile = getThing(myDataset, webID);
    return getUrl(profile, LDP.inbox);
  }
}
