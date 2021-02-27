export class ApMessage {
  inReplyTo: string;
  replyToMessageInboxUrl: string;

  name: string; // aka subject of email
  actor: string; // who created this activity, "from"; a subset of 'attributedTo'
  to: string[] = []; // list of (disclosed) recipients
  content: string;
}
