import {Inbox} from "./inbox";

export interface Contact {
  webId: string;
  name: string;
  inboxes: Inbox[];
}
