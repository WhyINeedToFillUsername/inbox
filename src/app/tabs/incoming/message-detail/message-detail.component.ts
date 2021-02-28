import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {InboxMessage} from "../../../model/inbox.message";
import {ActivatedRoute, Router} from "@angular/router";
import {InruptService} from "../../../services/inrupt/inrupt.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Inbox} from "../../../model/inbox";
import {SendService} from "../../../services/send/send.service";
import {ApMessage} from "../../../model/ap.message";

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit, OnDestroy {
  spinner: boolean = false;
  message: InboxMessage;
  jsonFields;
  inbox: Inbox;
  panelOpenState = false;
  private sub: any;

  constructor(
    private _location: Location,
    private readonly route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _inruptService: InruptService,
    private readonly _snackBar: MatSnackBar,
    private readonly _sendService: SendService
  ) {
  }

  ngOnInit(): void {
    this.spinner = true;
    this.sub = this.route.params.subscribe(params => {
      const inboxUrl = params['inboxUrl'];
      const messageId = params['messageId'];

      this._inruptService.prepareInbox(inboxUrl).then(
        inbox => {
          this.inbox = inbox;
          this.loadMessage(this.inbox, messageId);
        }
      );
    });
  }

  private loadMessage(inbox: Inbox, messageUrl: string) {
    this.spinner = true;
    this._inruptService.loadMessage(inbox, messageUrl)
      .then(message => this._parseMessage(message))
      .catch(error => {this._snackBar.open("Error loading message.", "Dismiss")})
      .finally(() => {this.spinner = false;});
  }

  goBack() {
    this._location.back();
  }

  private _parseMessage(message: InboxMessage) {
    this.message = message;
    if (MessageDetailComponent.shouldParseJson(message.type)) {
      try {
        this.jsonFields = JSON.parse(message.content);
      } catch (ignore) {}
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public static shouldParseJson(type: string): boolean {
    const typesToParse = ['application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
      'application/activity+json', 'application/json', 'application/ld+json']

    return typesToParse.includes(type);
  }

  reply() {
    let replyTo = new ApMessage();

    replyTo.inReplyTo = this.message.url;
    replyTo.replyToMessageInboxUrl = this.message.inbox.url;

    replyTo.name = this.jsonFields?.name;
    replyTo.actor = this.jsonFields?.actor;
    if (this.jsonFields?.object?.content) replyTo.content = "\n\n> " + this.jsonFields.object.content;
    else if (this.jsonFields?.content) replyTo.content = "\n\n> " + this.jsonFields.content;

    this._sendService.replyTo = replyTo;
    this._router.navigate(['/send/activity-pub']);
  }
}
