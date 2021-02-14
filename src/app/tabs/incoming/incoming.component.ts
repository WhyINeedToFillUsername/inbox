import {Component, OnInit} from '@angular/core';
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";
import {InruptService} from "../../services/inrupt/inrupt.service";
import {Inbox} from "../../model/inbox";

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.css']
})
export class IncomingComponent implements OnInit {
  inboxes: Inbox[];

  constructor(private readonly _inruptService: InruptService) {
  }

  ngOnInit(): void {
    this.readInboxes();
  }

  readInboxes() {
    InboxDiscoveryService.retrieveInboxUrlsFromWebId(this._inruptService.session.info.webId).then(
      inboxUrls => {
        this.inboxes = this._inruptService.prepareInboxes(inboxUrls);
      }
    );

  }
}
