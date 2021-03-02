import {Inbox} from "./inbox";
import {Contact} from "./contact";

export class InboxMessage {
  url: string;
  inbox: Inbox;
  content: string;
  type: string;
  created: Date;

  // Activity Streams fields
  inReplyTo: string;
  replyToMessageInboxUrl: string;

  name: string; // aka subject of email
  actor: Contact; // who created this activity, "from"; a subset of 'attributedTo'
  to: string[] = []; // list of (disclosed) recipients

  jsonFields; // object with all fields
}
