import {InboxMessage} from "./inbox.message";

export class Inbox {
  url: string; // id
  name: string;
  messages: InboxMessage[];
  isMonitored: boolean;
  style: string;
}
