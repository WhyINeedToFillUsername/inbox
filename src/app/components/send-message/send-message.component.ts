import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  messageContent: string;
  to: string;

  constructor(
    private readonly _snackBar: MatSnackBar,
    private readonly http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.messageContent = "";
  }

  async send() {
    let destinationInbox = await InboxDiscoveryService.retrieveInboxUrlFromWebId(this.to);
    if (destinationInbox) {
      this.http.post(destinationInbox, this.messageContent, {responseType: 'text'}).subscribe(
        data => {
          this._snackBar.open("Message sent!", "Dismiss");
          this.messageContent = "";
          this.to = "";
          console.log(data)
        },
        error => {this._snackBar.open("Error sending message. " + error);}
      );

    } else {
      this._snackBar.open("Couldn't find an inbox.");
    }
  }
}
