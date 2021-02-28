import {Component, OnInit, ViewChild} from '@angular/core';
import {ApMessage} from "../../../model/ap.message";
import {SendService} from "../../../services/send/send.service";
import {ContactInbox} from "../../../model/contact.inbox";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RecipientsPickerComponent} from "../../../components/recipients-picker/recipients-picker.component";

@Component({
  selector: 'app-send-activity-pub',
  templateUrl: './send-activity-pub.component.html',
  styleUrls: ['./send-activity-pub.component.css']
})
export class SendActivityPubComponent {
  subject: string = "";
  messageContent: string = "";
  messageError: string = null;
  replyTo: ApMessage;

  @ViewChild(RecipientsPickerComponent)
  picker: RecipientsPickerComponent;

  constructor(
    private readonly _snackBar: MatSnackBar,
    private readonly _sendService: SendService
  ) {
    if (this._sendService.replyTo) {
      this.replyTo = this._sendService.replyTo;
      this.messageContent = this.replyTo.content;
      this._sendService.replyTo = undefined;
    }
  }

  send() {
    let selectedRecipients: ContactInbox[] = this.picker.recipients;
    this.messageContent = this.messageContent.trim();
    this.subject = this.subject.trim();
    this.messageError = null;

    if (selectedRecipients && selectedRecipients.length === 0) {
      this.picker.errors.push("No recipients!");
      return;
    }

    if (!this.messageContent) {
      this.messageError = "Message cannot be empty!";
      return;
    }

    if (!this.subject) {
      this.messageError = "Subject cannot be empty!";
      return;
    }

    this._sendService.sendActivityPubMessage(selectedRecipients, this.subject, this.messageContent, this.replyTo).subscribe(
      data => {
        this._snackBar.open("Message sent!", "Dismiss");
        this.messageContent = "";
        this.subject = "";
        this.picker.recipients = [];
        this.picker.errors = [];
      },
      error => {
        this._snackBar.open("Error sending message. " + error, "Dismiss");
      }
    );
  }
}
