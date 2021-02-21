import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";
import {RecipientsPickerComponent} from "../../components/recipients-picker/recipients-picker.component";
import {SendService} from "../../services/send/send.service";

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {
  messageContent: string = "";
  messageError: string = null;

  @ViewChild(RecipientsPickerComponent)
  picker: RecipientsPickerComponent;

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly _sendService: SendService) {
  }

  ngOnInit(): void {
  }

  async send() {
    let selectedRecipients = this.picker.recipients;
    this.messageContent = this.messageContent.trim();
    this.messageError = null;

    if (selectedRecipients && selectedRecipients.length === 0) {
      this.picker.errors.push("No recipients!");
      return;
    }

    if (!this.messageContent) {
      this.messageError = "Message cannot be empty!";
      return;
    }

    let promises = [];
    let recipients = [];
    let errors = [];

    for (const selectedRecipient of selectedRecipients) {
      promises.push(InboxDiscoveryService.retrieveInboxUrlFromWebId(selectedRecipient.webId)
        .then(inboxUrl => {recipients.push(inboxUrl);})
        .catch(error => {errors.push("Couldn't find inbox for " + selectedRecipient);})
      )
    }

    Promise.all(promises).then(
      () => {
        if (errors.length === 0) {
          this._sendService.send(recipients, this.messageContent).subscribe(
            data => {
              this._snackBar.open("Message sent!", "Dismiss");
              this.messageContent = "";
              this.picker.recipients = [];
              this.picker.errors = [];
            },
            error => {
              this._snackBar.open("Error sending message. " + error);
            }
          );
        } else {
          this.picker.errors = errors;
        }
      }
    );
  }
}
