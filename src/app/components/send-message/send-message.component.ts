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

      // 2) construct message
      // const message = createMessage(webID, destinationResourceIRI, this.messageContent);
      const message = this.messageContent;

      // 3) ajax post to IRI
      // this.http.post(destinationInbox, message, {responseType: 'text'}).subscribe({
      //   next: data => {
      //     sent = true;
      //     console.log(data)
      //   },
      //   error: err => {
      //     error = err
      //     console.log(err)
      //   }
      // });
      this.http.post(destinationInbox, message, {responseType: 'text'}).subscribe(
        data => {
          this._snackBar.open("Message sent!", "Dismiss");
          this.messageContent = "";
          this.to = "";
          console.log(data)
        },
        error1 => {this._snackBar.open("Error sending message. " + error1);},
        () => {console.log("compleled")}
      );

    } else {
      this._snackBar.open("Couldn't find an inbox.");
    }
  }
}
