import {Component, OnInit} from '@angular/core';
import {MonitorInboxesService} from "../../services/monitor-inboxes/monitor-inboxes.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SystemNotificationsService} from "../../services/system-notifications/system-notifications.service";
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";

@Component({
  selector: 'app-monitor-inboxes',
  templateUrl: './monitor-inboxes.component.html',
  styleUrls: ['./monitor-inboxes.component.css']
})
export class MonitorInboxesComponent implements OnInit {
  inboxUrl: string = "";
  targetUrl: string = "";
  monitoredInboxes: string[];
  notificationsSystemSupports: boolean;
  notificationPermission: string;

  constructor(private readonly _monitorInboxesService: MonitorInboxesService,
              private readonly _snackBar: MatSnackBar,
              private readonly _systemNotificationsService: SystemNotificationsService) {
  }

  ngOnInit(): void {
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
    this.setEnableButtonState();
  }

  startMonitoringClick() {
    this._startMonitoringInbox(this.inboxUrl);
    this.inboxUrl = "";
  }

  discoverAndStartMonitoring() {
    InboxDiscoveryService.discoverInboxUrlFromTarget(this.targetUrl).then(
      inboxUrl => {
        this._startMonitoringInbox(inboxUrl);
        this.targetUrl = "";
      },
      error => {
        this._snackBar.open("Couldn't find inbox on the entered target.", "Dismiss");
      }
    );
  }

  private _startMonitoringInbox(inboxUrl: string) {
    this._monitorInboxesService.addInboxToMonitor(inboxUrl);
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
  }

  stopMonitoring(inboxUrl: string) {
    this._monitorInboxesService.removeInboxFromMonitored(inboxUrl);
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
  }

  setEnableButtonState() {
    this.notificationsSystemSupports = 'Notification' in window;
    this.notificationPermission = Notification.permission;
  }

  enableSystemNotification() {
    Notification.requestPermission()
      .then(permission => {
        this._snackBar.open("Notifications: " + permission, "Dismiss");
        this.setEnableButtonState();
      })
  }

  testNotification() {
    this._systemNotificationsService.notify(undefined, "test notification");
  }
}
