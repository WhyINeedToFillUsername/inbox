import {Component, OnInit} from '@angular/core';
import {MonitorInboxesService} from "../../services/monitor-inboxes/monitor-inboxes.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SystemNotificationsService} from "../../services/system-notifications/system-notifications.service";
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";
import {SendService} from "../../services/send/send.service";

@Component({
  selector: 'app-monitor-inboxes',
  templateUrl: './monitor-inboxes.component.html',
  styleUrls: ['./monitor-inboxes.component.css']
})
export class MonitorInboxesComponent implements OnInit {
  targetUrl: string = "";
  inboxUrl: string = "";
  monitoredInboxes: string[];
  notificationsSystemSupports: boolean;
  notificationPermission: string;

  constructor(private readonly _monitorInboxesService: MonitorInboxesService,
              private readonly _snackBar: MatSnackBar,
              private readonly _systemNotificationsService: SystemNotificationsService,
              private readonly _sendService: SendService) {
  }

  ngOnInit(): void {
    this.monitoredInboxes = this._monitorInboxesService.getManuallyAddedMonitoredInboxes();
    this.setEnableButtonState();
  }

  discoverAndStartMonitoring() {
    if (!this.targetUrl || !this.targetUrl.trim()) {
      this.targetUrl = "";
      this._snackBar.open("Empty input!", "Dismiss");
      return;
    }

    InboxDiscoveryService.retrieveInboxUrlFromWebId(this.targetUrl).then(
      inboxUrl => {
        if (!inboxUrl) {
          this._snackBar.open("Couldn't find inbox on the entered target.", "Dismiss");
          return;
        }

        this._startMonitoringInbox(inboxUrl);
        this.targetUrl = "";
      },
      error => {
        this._snackBar.open("Couldn't find inbox on the entered target.", "Dismiss");
      }
    );
  }

  startMonitoringInboxDirectly() {
    if (!this.inboxUrl || !this.inboxUrl.trim()) {
      this.inboxUrl = "";
      this._snackBar.open("Empty input!", "Dismiss");
      return;
    }

    this._sendService.isInboxIri(this.inboxUrl).subscribe(isInbox => {
      if (isInbox) {
        this._startMonitoringInbox(this.inboxUrl);
        this.inboxUrl = "";
      } else {
        this._snackBar.open("Entered url doesn't contain inbox.", "Dismiss");
      }
    }, error => {
      this._snackBar.open("Entered url doesn't contain inbox.", "Dismiss");
    });
  }

  private _startMonitoringInbox(inboxUrl: string) {
    if (this._monitorInboxesService.userProfileInboxes.includes(inboxUrl)) {
      this._snackBar.open("This inbox is already automatically monitored from your profile.", "Dismiss");
      return;
    }
    this._monitorInboxesService.addInboxToMonitorByUrl(inboxUrl);
    this.monitoredInboxes = this._monitorInboxesService.getManuallyAddedMonitoredInboxes();
  }

  stopMonitoring(inboxUrl: string) {
    this._monitorInboxesService.removeInboxFromMonitored(inboxUrl);
    this.monitoredInboxes = this._monitorInboxesService.getManuallyAddedMonitoredInboxes();
  }

  setEnableButtonState() {
    this.notificationsSystemSupports = 'Notification' in window;
    this.notificationPermission = Notification.permission;
  }
}
