import {Component, OnDestroy, OnInit} from '@angular/core';
import {InruptService} from "../../../services/inrupt/inrupt.service";
import {InboxMessage} from "../../../model/inbox.message";
import {Inbox} from "../../../model/inbox";
import {ActivatedRoute} from "@angular/router";
import {MonitorInboxesService} from "../../../services/monitor-inboxes/monitor-inboxes.service";
import {SystemNotificationsService} from "../../../services/system-notifications/system-notifications.service";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css', '/src/assets/styles/table.css', '/src/assets/styles/spinner-button.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  workingInbox: boolean = false;
  inboxes: Inbox[];
  inbox: Inbox;
  messages: InboxMessage[];
  columnsToDisplay;
  showNotificationButton: boolean = false;
  private sub: any;

  constructor(private readonly _inruptService: InruptService,
              private readonly route: ActivatedRoute,
              private readonly _monitorInboxesService: MonitorInboxesService
  ) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      const inboxUrl = params['inboxUrl'];

      if (inboxUrl) {
        this.columnsToDisplay = ['actor', 'content', 'created'];
        this._readInbox(inboxUrl);
      } else {
        this.columnsToDisplay = ['actor', 'inbox', 'content', 'created'];
        this.loadAllMessages();
      }
    });

    this.showNotificationButton = MessageListComponent._setShowNotificationButton();
  }

  readInbox(inbox: Inbox) {
    this._readInbox(inbox.url);
  }

  async _readInbox(inboxUrl: string) {
    this.workingInbox = true;
    this.messages = [];
    this.inbox = await this._inruptService.prepareInbox(inboxUrl);

    this._inruptService.loadMessagesOfInbox(this.inbox).then(
      messages => {
        this.inbox.messages = messages;
        this.messages = this.messages.concat(messages);
        this.workingInbox = false;
      }
    );

  }

  reloadAllMessages() {
    this._inruptService.reloadAllMessages();
    this.loadAllMessages();
  }

  loadAllMessages() {
    this.workingInbox = true;
    this.messages = [];

    this._inruptService.allMessages$.subscribe(allMessages => {
      this.messages = allMessages;
      this.workingInbox = false;
    });

    this.showNotificationButton = MessageListComponent._setShowNotificationButton();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private static _setShowNotificationButton(): boolean {
    return SystemNotificationsService.systemSupportsNotifications() && !SystemNotificationsService.systemNotificationsEnabled();
  }
}

