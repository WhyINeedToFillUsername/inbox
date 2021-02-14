import {Component, OnDestroy, OnInit} from '@angular/core';
import {InruptService} from "../../../services/inrupt/inrupt.service";
import {InboxMessage} from "../../../components/inrupt/model/inbox.message";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Inbox} from "../../../components/inrupt/model/inbox";
import {InboxDiscoveryService} from "../../../services/discovery/inbox-discovery.service";
import {ActivatedRoute} from "@angular/router";
import {MonitorInboxesService} from "../../../services/monitor-inboxes/monitor-inboxes.service";

@Component({
  selector: 'app-all-incoming',
  templateUrl: './all-incoming.component.html',
  styleUrls: ['./all-incoming.component.css', '/src/assets/styles/table.css', '/src/assets/styles/spinner-button.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AllIncomingComponent implements OnInit, OnDestroy {
  workingInbox: boolean = false;
  inboxes: Inbox[];
  inbox: Inbox;
  messages: InboxMessage[];
  columnsToDisplay;
  expandedElement: InboxMessage | null;
  private sub: any;

  constructor(private readonly _inruptService: InruptService,
              private readonly route: ActivatedRoute,
              private readonly _monitorInboxesService: MonitorInboxesService,
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
    const r = inboxId.slice(0, 2);
    const g = inboxId.slice(2, 4);
    const b = inboxId.slice(6, 8);
    return "background-color: rgb(" + r + ", " + g + ", " + b + "); text-shadow: 1px 1px 2px white; mix-blend-mode: difference;"
  }

  monitor(inbox: Inbox) {
    this._monitorInboxesService.addInboxToMonitor(inbox);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

