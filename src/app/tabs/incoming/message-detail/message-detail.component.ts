import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {InboxMessage} from "../../../model/inbox.message";
import {ActivatedRoute} from "@angular/router";
import {InruptService} from "../../../services/inrupt/inrupt.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Inbox} from "../../../model/inbox";

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit, OnDestroy {
  spinner: boolean = false;
  message: InboxMessage;
  inbox: Inbox;
  private sub: any;

  constructor(
    private _location: Location,
    private readonly route: ActivatedRoute,
    private readonly _inruptService: InruptService,
    private readonly _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      const inboxUrl = params['inboxUrl'];
      const messageId = params['messageId'];

      this.inbox = this._inruptService.prepareInbox(inboxUrl);
      this.loadMessage(this.inbox, messageId);
    });
  }

  private loadMessage(inbox: Inbox, messageUrl: string) {
    this.spinner = true;
    this._inruptService.loadMessage(inbox, messageUrl)
      .then(message => this.message = message)
      .catch(error => {this._snackBar.open("Error loading message.", "Dismiss")})
      .finally(() => {this.spinner = false;});
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
