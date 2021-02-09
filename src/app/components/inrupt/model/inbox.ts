import {InboxMessage} from "./inbox.message";

export class Inbox {
  id: string;
  url: string;
  messages: InboxMessage[];
  isMonitored: boolean;
}
