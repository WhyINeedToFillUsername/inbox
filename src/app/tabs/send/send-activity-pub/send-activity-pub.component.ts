import {Component, OnInit} from '@angular/core';
import {ApMessage} from "../../../model/ap.message";
import {SendService} from "../../../services/send/send.service";

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

  constructor(
    private readonly _sendService: SendService
  ) {
    if (this._sendService.replyTo) {
      this.replyTo = this._sendService.replyTo;
      this.messageContent = this.replyTo.content;
      this._sendService.replyTo = undefined;
    }
  }

  send() {

  }
}
