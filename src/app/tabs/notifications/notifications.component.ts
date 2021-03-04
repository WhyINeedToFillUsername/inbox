import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SystemNotificationsService} from "../../services/system-notifications/system-notifications.service";
import {MessageSnackbarComponent} from "../../components/message-snackbar/message-snackbar.component";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notificationsSystemSupports: boolean;
  notificationPermission: string;

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly _systemNotificationsService: SystemNotificationsService) {
  }

  ngOnInit(): void {
    this.setEnableButtonState();
  }

  setEnableButtonState() {
    this.notificationsSystemSupports = SystemNotificationsService.systemSupportsNotifications()
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
    this._snackBar.openFromComponent(MessageSnackbarComponent, {data: ""});
  }
}
