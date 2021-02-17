import {Component, OnDestroy, OnInit} from '@angular/core';
import {InruptService} from "../../../services/inrupt/inrupt.service";
import {InboxMessage} from "../../../model/inbox.message";
import {Inbox} from "../../../model/inbox";
import {ActivatedRoute} from "@angular/router";
import {MonitorInboxesService} from "../../../services/monitor-inboxes/monitor-inboxes.service";

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
        this.columnsToDisplay = ['created', 'url', 'type'];
        this._readInbox(inboxUrl);
      } else {
        this.columnsToDisplay = ['created', 'inbox', 'url', 'type'];
        this.readInboxes();
      }
    });
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

  readInboxes() {
    this.workingInbox = true;
    this.messages = [];

    this._inruptService.inboxes$.subscribe(
      inboxes => {
        this.inboxes = inboxes;
        let promises = [];

        for (const inbox of this.inboxes) {
          promises.push(this._inruptService.loadMessagesOfInbox(inbox)
            .then(
              messages => {
                inbox.messages = messages;
                this.messages = this.messages.concat(messages);
              }
            ));
        }

        Promise.all(promises).then(() => {
          this.workingInbox = false;
        });
      });
  }

  monitor(inbox: Inbox) {
    this._monitorInboxesService.addInboxToMonitor(inbox);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

