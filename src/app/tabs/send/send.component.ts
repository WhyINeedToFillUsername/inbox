import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";
import {RecipientsPickerComponent} from "../../components/recipients-picker/recipients-picker.component";

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {
  messageContent: string;
  to: string;

  @ViewChild(RecipientsPickerComponent)
  picker: RecipientsPickerComponent;

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly http: HttpClient) {
  }

  ngOnInit(): void {
    this.messageContent = "";
  }

  async send() {
    this.to = this.picker.selectedFriends[0]; // TODO discover and send to all recipients
    let destinationInbox = await InboxDiscoveryService.retrieveInboxUrlFromWebId(this.to);
    if (destinationInbox) {
      this.http.post(destinationInbox, this.messageContent, {responseType: 'text'}).subscribe(
        data => {
          this._snackBar.open("Message sent!", "Dismiss");
          this.messageContent = "";
          this.to = "";
          console.log(data)
        },
        error => {
          this._snackBar.open("Error sending message. " + error);
        }
      );

    } else {
      this._snackBar.open("Couldn't find an inbox.");
    }
  }
}
