import {Injectable} from '@angular/core';
import {BrowserStorageService} from "../browser-storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SystemNotificationsService} from "../system-notifications/system-notifications.service";
import {Inbox} from "../../model/inbox";
import {MessageSnackbarComponent} from "../../components/message-snackbar/message-snackbar.component";

@Injectable({
  providedIn: 'root'
})
export class MonitorInboxesService {

  public static readonly MONITORED_INBOXES_STORAGE_KEY: string = "MONITORED_INBOXES_STORAGE_KEY";
  private static readonly WS_SOLID_PROTOCOL = 'solid.0.1.0-alpha'; // originally 'solid/0.1.0-alpha', now 'solid-0.1'

  constructor(private readonly _snackBar: MatSnackBar,
              private readonly _systemNotificationsService: SystemNotificationsService) {
  }

  startMonitoring() {
    const monitoredInboxes: string[] = this.getMonitoredInboxes();
    if (!monitoredInboxes) return;

    for (const monitoredInbox of monitoredInboxes) {
      this.connect(monitoredInbox);
    }
  }

  getMonitoredInboxes(): string[] {
    const monitoredInboxes = BrowserStorageService.loadFromLocalStorage(MonitorInboxesService.MONITORED_INBOXES_STORAGE_KEY);
    if (!monitoredInboxes) return [];
    else return monitoredInboxes;
  }

  addInboxToMonitorByUrl(inboxUrl: string) {
    let inboxesToMonitor: string[] = this.getMonitoredInboxes();

    if (!inboxesToMonitor.includes(inboxUrl)) {

      inboxesToMonitor.push(inboxUrl);

      BrowserStorageService.saveToLocalStorage(MonitorInboxesService.MONITORED_INBOXES_STORAGE_KEY, inboxesToMonitor);
      this.connect(inboxUrl, true);
    }
  }

  addInboxToMonitor(inbox: Inbox) {
    this.addInboxToMonitorByUrl(inbox.url);
  }

  removeInboxFromMonitored(inboxUrl: string) {
    const monitoredInboxes: string[] = this.getMonitoredInboxes();
    const inboxesToMonitor: string[] = monitoredInboxes.filter(url => url !== inboxUrl);

    BrowserStorageService.saveToLocalStorage(MonitorInboxesService.MONITORED_INBOXES_STORAGE_KEY, inboxesToMonitor);
    this._snackBar.open("Removed '" + inboxUrl + "' from monitored inboxes.", "Dismiss");
  }

  private connect(inboxUrl: string, connectNew: boolean = false) {
    let socket = new WebSocket(MonitorInboxesService.getWsUrlFromInboxUrl(inboxUrl), MonitorInboxesService.WS_SOLID_PROTOCOL);
    socket.onopen = this.onopenCallback(inboxUrl, this._snackBar, connectNew);

    socket.onmessage = (msg) => {
      if (msg.data && msg.data.slice(0, 3) === 'pub') {
        this._snackBar.openFromComponent(MessageSnackbarComponent, {data: inboxUrl});
        this._systemNotificationsService.inboxNotification(inboxUrl);
      }
    }
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

  isInboxMonitored(inboxUrl: string): boolean {
    return this.getMonitoredInboxes().includes(inboxUrl);
  }
}
