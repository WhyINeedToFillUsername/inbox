import {InboxMessage} from "./inbox.message";

export class Inbox {
  id: number;
  url: string;
  messages: InboxMessage[];
  isMonitored: boolean;
}
