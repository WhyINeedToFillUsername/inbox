import {Inbox} from "./inbox";

export class InboxMessage {
  url: string;
  inbox: Inbox;
  content: string;
  type: string;
  created: Date;

  // ActivityPub fields
  inReplyTo: string;
  replyToMessageInboxUrl: string;

  name: string; // aka subject of email
  actor: string; // who created this activity, "from"; a subset of 'attributedTo'
  to: string[] = []; // list of (disclosed) recipients

  jsonFields; // object with all fields
}
