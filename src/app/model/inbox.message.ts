import {Inbox} from "./inbox";

export interface InboxMessage {
  url: string;
  inbox: Inbox;
  content: string;
  type: string;
  created: Date;
}
