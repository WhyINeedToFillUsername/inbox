import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SystemNotificationsService} from "../system-notifications/system-notifications.service";
import {MessageSnackbarComponent} from "../../components/message-snackbar/message-snackbar.component";
import {InruptService} from "../inrupt/inrupt.service";
import {InboxDiscoveryService} from "../discovery/inbox-discovery.service";

@Injectable({
  providedIn: 'root'
})
export class MonitorInboxesService {

  sockets: WebSocket[] = [];

  private static readonly WS_SOLID_PROTOCOL = 'solid.0.1.0-alpha'; // originally 'solid/0.1.0-alpha', now 'solid-0.1'

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly _systemNotificationsService: SystemNotificationsService,
              private readonly _inruptService: InruptService,
              private zone: NgZone) {
  }

  startMonitoringUserInboxes() {
    InboxDiscoveryService.retrieveInboxUrlsFromWebId(this._inruptService.getSessionWebId()).then(inboxUrls => {
      for (const inboxUrl of inboxUrls) {
        this.connect(inboxUrl);
      }
    });
  }

  stopMonitoringUserInboxes() {
    for (const socket of this.sockets) {
      socket.close();
    }
  }

  private connect(inboxUrl: string, connectNew: boolean = false) {
    let socket = new WebSocket(MonitorInboxesService.getWsUrlFromInboxUrl(inboxUrl), MonitorInboxesService.WS_SOLID_PROTOCOL);
    socket.onopen = this.onopenCallback(inboxUrl, this._snackBar, connectNew);

    socket.onmessage = (msg) => {
      if (msg.data && msg.data.slice(0, 3) === 'pub') {
        this.zone.run(() => {
          this._snackBar.openFromComponent(MessageSnackbarComponent, {data: inboxUrl});
          this._systemNotificationsService.inboxNotification(inboxUrl);
        });
      }
    }
    this.sockets.push(socket);
  }

  static getWsUrlFromInboxUrl(inboxUrl: string) {
    const urlParts = new URL(inboxUrl).hostname.split('.')

    const urlWithoutSubdomain = urlParts
      .slice(0)
      .slice(-(urlParts.length === 4 ? 3 : 2))
      .join('.');
    return "wss://" + urlWithoutSubdomain + "/";
  }

  private onopenCallback = function (inboxUrl: string, _snackBar: MatSnackBar, connectNew: boolean) {
    return function () {
      this.send('sub ' + inboxUrl);
      if (connectNew) _snackBar.open("Successfully added inbox to monitor: " + inboxUrl, "Dismiss");
    }
  }
}
