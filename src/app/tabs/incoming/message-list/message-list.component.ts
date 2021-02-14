import {Component, OnDestroy, OnInit} from '@angular/core';
import {InruptService} from "../../../services/inrupt/inrupt.service";
import {InboxMessage} from "../../../model/inbox.message";
import {Inbox} from "../../../model/inbox";
import {InboxDiscoveryService} from "../../../services/discovery/inbox-discovery.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MonitorInboxesService} from "../../../services/monitor-inboxes/monitor-inboxes.service";
import {CommonHelper} from "../../../helpers/common.helper";

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
              private readonly _monitorInboxesService: MonitorInboxesService,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      const inboxId = params['inboxId'];

      if (inboxId) {
        this.columnsToDisplay = ['created', 'url', 'type'];
        this.readInbox(inboxId);
      } else {
        this.columnsToDisplay = ['created', 'inboxId', 'url', 'type'];
        this.readInboxes();
      }
    });
  }

  readInbox(inboxId: string) {
    this.workingInbox = true;
    this.messages = [];

    this._inruptService.getInboxById(inboxId).then(inbox => {
      this.inbox = inbox;
      this._inruptService.loadMessagesOfInbox(this.inbox).then(
        messages => {
          this.inbox.messages = messages;
          this.messages = this.messages.concat(messages);
          this.workingInbox = false;
        }
      );
    })

  }

  readInboxes() {
    this.workingInbox = true;

    this.messages = [];

    InboxDiscoveryService.retrieveInboxUrlsFromWebId(this._inruptService.session.info.webId)
      .then(inboxUrls => {
        this.inboxes = this._inruptService.prepareInboxes(inboxUrls);
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

  getStyle(inboxId: string) {
    return CommonHelper.getStyle(inboxId);
  }

  goToMessageDetail(element) {
    this.router.navigate(['/incoming/', element.inboxId, element.url]);
  }

  monitor(inbox: Inbox) {
    this._monitorInboxesService.addInboxToMonitor(inbox);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

