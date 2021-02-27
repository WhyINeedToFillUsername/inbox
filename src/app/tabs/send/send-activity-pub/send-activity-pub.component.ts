import { Component, OnInit } from '@angular/core';
import {ApMessage} from "../../../model/ap.message";

@Component({
  selector: 'app-send-activity-pub',
  templateUrl: './send-activity-pub.component.html',
  styleUrls: ['./send-activity-pub.component.css']
})
export class SendActivityPubComponent implements OnInit {
  messageContent: string = "";
  messageError: string = null;
  replyTo: ApMessage;

  constructor() { }

  ngOnInit(): void {
  }

  send() {

  }
}
