import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {RecipientsPickerComponent} from "../../components/recipients-picker/recipients-picker.component";
import {SendService} from "../../services/send/send.service";
import {ContactInbox} from "../../model/contact.inbox";
import {ApMessage} from "../../model/ap.message";

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent {
  messageContent: string = "";
  messageError: string = null;
  replyTo: ApMessage;

  @ViewChild(RecipientsPickerComponent)
  picker: RecipientsPickerComponent;

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly _sendService: SendService) {
    if (this._sendService.replyTo) {
      this.replyTo = this._sendService.replyTo;
      this.messageContent = this.replyTo.content;
      this._sendService.replyTo = undefined;
    }
  }

  async send() {
    let selectedRecipients: ContactInbox[] = this.picker.recipients;
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

    this._sendService.send(selectedRecipients, this.messageContent).subscribe(
      data => {
        this._snackBar.open("Message sent!", "Dismiss");
        this.messageContent = "";
        this.picker.recipients = [];
        this.picker.errors = [];
      },
      error => {
        this._snackBar.open("Error sending message. " + error.toString(), "Dismiss");
      }
    );
  }
}
