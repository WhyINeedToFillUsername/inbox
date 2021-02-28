import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SystemNotificationsService {

  constructor(
    private readonly _router: Router) {
  }

  notify(title: string = "New inbox notification", text: string = "", tag: string = "inbox-notification") {
    const img = '/favicon.ico';
    const options = {
      body: text,
      icon: img,
      // image: img,
      tag: tag, // An ID for a given notification that allows you to find, replace, or remove the notification using a script if necessary.
      badge: img // URL of an image to represent the notification when there is not enough space to display the notification itself
    };
    // new Notification(title, options);
    const notification = new Notification(title, options);

    notification.addEventListener('click', function () {
      alert(text);
    });
  }

  inboxNotification(inboxUrl: string) {
    const img = '/favicon.ico';
    const options = {
      body: "You got new message in your inbox " + inboxUrl,
      icon: img,
      tag: "inbox-notification",
      badge: img
    };
    const notification = new Notification("New message in your inbox", options);

    notification.addEventListener('click', () => {
      this._router.navigate(['/incoming/', inboxUrl])
    });
  }

  static systemSupportsNotifications(): boolean {
    return 'Notification' in window;
  }

  static systemNotificationsEnabled(): boolean {
    return Notification.permission === 'granted';
  }
}
