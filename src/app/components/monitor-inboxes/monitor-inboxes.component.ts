import {Component, OnInit} from '@angular/core';
import {MonitorInboxesService} from "../../services/monitor-inboxes/monitor-inboxes.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-monitor-inboxes',
  templateUrl: './monitor-inboxes.component.html',
  styleUrls: ['./monitor-inboxes.component.css']
})
export class MonitorInboxesComponent implements OnInit {
  inboxUrl: string = "";
  monitoredInboxes: string[];
  notificationsSystemSupports: boolean;
  notificationPermission: string;

  constructor(private readonly _monitorInboxesService: MonitorInboxesService,
              private readonly _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
    this.setEnableButtonState();
  }

  startMonitoring() {
    this._monitorInboxesService.addInboxToMonitor(this.inboxUrl);
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
  }

  stopMonitoring(inboxUrl: string) {
    this._monitorInboxesService.removeInboxFromMonitored(inboxUrl);
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
  }

  setEnableButtonState() {
    this.notificationsSystemSupports = 'Notification' in window;
    this.notificationPermission = Notification.permission;
    console.log(this.notificationPermission);
  }

  enableSystemNotification() {
    Notification.requestPermission()
      .then(permission => {
        this._snackBar.open("Notifications: " + permission, "Dismiss");
        this.setEnableButtonState();
      })
  }

  testNotification() {
    const img = 'https://spyna.it/icons/android-icon-192x192.png';
    const text = 'HEY! text';
    const title = 'HEY! title';
    const options = {
      body: text,
      icon: img,
      image: img,
      tag: "test-notification", // An ID for a given notification that allows you to find, replace, or remove the notification using a script if necessary.
      badge: "https://spyna.it/icons/android-icon-192x192.png" // URL of an image to represent the notification when there is not enough space to display the notification itself
    };
    const notification = new Notification(title, options);

    // Notification api supports events. It is not very reliable - various results in various browsers.
    // Uncomment the code below to test it.
    // notification.addEventListener('click', function () {
    //     clicked('click');
    // });
    //
    // notification.addEventListener('close', function () {
    //     clicked('close');
    // });
    //
    // notification.addEventListener('error', function () {
    //     clicked('error');
    // });
    //
    // notification.addEventListener('show', function () {
    //     clicked('show');
    // })
  }
}
