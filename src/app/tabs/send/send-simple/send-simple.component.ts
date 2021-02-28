import {Component, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {RecipientsPickerComponent} from "../../../components/recipients-picker/recipients-picker.component";
import {SendService} from "../../../services/send/send.service";
import {ContactInbox} from "../../../model/contact.inbox";

@Component({
  selector: 'app-send',
  templateUrl: './send-simple.component.html',
  styleUrls: ['./send-simple.component.css']
})
export class SendSimpleComponent {
  messageContent: string = "";
  messageError: string = null;

  @ViewChild(RecipientsPickerComponent)
  picker: RecipientsPickerComponent;

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly _sendService: SendService) {
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

    this._sendService.sendSimpleMessage(selectedRecipients, this.messageContent).subscribe(
      data => {
        this._snackBar.open("Message sent!", "Dismiss");
        this.messageContent = "";
        this.picker.recipients = [];
        this.picker.errors = [];
      },
      error => {
        this._snackBar.open("Error sending message. " + error, "Dismiss");
      }
    );
  }
}
