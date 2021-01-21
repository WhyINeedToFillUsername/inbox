import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemNotificationsService {

  constructor() {
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
}
