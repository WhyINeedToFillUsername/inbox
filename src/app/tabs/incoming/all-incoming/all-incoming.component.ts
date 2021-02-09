import {Component, OnInit} from '@angular/core';
import {InruptService} from "../../../services/inrupt/inrupt.service";
import {InboxMessage} from "../../../components/inrupt/model/inbox.message";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Inbox} from "../../../components/inrupt/model/inbox";
import {InboxDiscoveryService} from "../../../services/discovery/inbox-discovery.service";

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
export class AllIncomingComponent implements OnInit {
  workingInbox: boolean = false;
  inboxes: Inbox[];
  messages: InboxMessage[];
  columnsToDisplay = ['created', 'inboxId', 'url', 'type'];
  expandedElement: InboxMessage | null;

  constructor(private readonly _inruptService: InruptService) {
  }

  ngOnInit(): void {
    this.readInboxes();
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
}
