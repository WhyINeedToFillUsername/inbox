import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {InboxMessage} from "../../../model/inbox.message";
import {ActivatedRoute} from "@angular/router";
import {InruptService} from "../../../services/inrupt/inrupt.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit, OnDestroy {
  spinner: boolean = false;
  message: InboxMessage;
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
      const inboxId = params['inboxId'];
      const messageId = params['messageId'];

      this.loadMessage(inboxId, messageId);
    });
  }

  private loadMessage(inboxId: string, messageUrl: string) {
    this.spinner = true;
    console.log(inboxId, messageUrl);
    this._inruptService.loadMessage(messageUrl)
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
