import {Injectable} from '@angular/core';
import {BrowserStorageService} from "../browser-storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SystemNotificationsService} from "../system-notifications/system-notifications.service";

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
    console.log("monitoring", monitoredInboxes);
    if (!monitoredInboxes) return;

    for (const monitoredInbox of monitoredInboxes) {
      this.connect(monitoredInbox);
    }
  }

  getMonitoredInboxes(): string[] {
    return BrowserStorageService.loadFromLocalStorage(MonitorInboxesService.MONITORED_INBOXES_STORAGE_KEY);
  }

  addInboxToMonitor(inboxUrl: string) {
    let inboxesToMonitor: string[];
    const monitoredInboxes: string[] = BrowserStorageService.loadFromLocalStorage(MonitorInboxesService.MONITORED_INBOXES_STORAGE_KEY);

    if (monitoredInboxes) inboxesToMonitor = monitoredInboxes;
    else inboxesToMonitor = [];

    inboxesToMonitor.push(inboxUrl)

    BrowserStorageService.saveToLocalStorage(MonitorInboxesService.MONITORED_INBOXES_STORAGE_KEY, inboxesToMonitor);
    this.connect(inboxUrl, true);
  }

  removeInboxFromMonitored(inboxUrl: string) {
    const monitoredInboxes: string[] = BrowserStorageService.loadFromLocalStorage(MonitorInboxesService.MONITORED_INBOXES_STORAGE_KEY);
    const inboxesToMonitor: string[] = monitoredInboxes.filter(url => url !== inboxUrl);

    BrowserStorageService.saveToLocalStorage(MonitorInboxesService.MONITORED_INBOXES_STORAGE_KEY, inboxesToMonitor);
    this._snackBar.open("Removed '" + inboxUrl + "' from monitored inboxes.", "Dismiss");
  }

  private connect(inboxUrl: string, connectNew: boolean = false) {
    let socket = new WebSocket(MonitorInboxesService.getWsUrlFromInboxUrl(inboxUrl), MonitorInboxesService.WS_SOLID_PROTOCOL);
    socket.onopen = this.onopenCallback(inboxUrl, this._snackBar, connectNew);
    socket.onmessage = this.onmessageCallback(inboxUrl, this._snackBar, this._systemNotificationsService);
  }

  static getWsUrlFromInboxUrl(inboxUrl: string) {
    const urlParts = new URL(inboxUrl).hostname.split('.')

    const urlWithoutSubdomain = urlParts
      .slice(0)
      .slice(-(urlParts.length === 4 ? 3 : 2))
      .join('.');
    return "wss://" + urlWithoutSubdomain + "/";
  }

  private onmessageCallback = function (inboxUrl: string, _snackBar: MatSnackBar, _systemNotificationsService: SystemNotificationsService) {
    return function (msg) {
      console.log("message:", msg);
      if (msg.data && msg.data.slice(0, 3) === 'pub') {
        // resource updated, refetch resource
        _snackBar.open("You got new message on the inbox " + inboxUrl, "Dismiss");
        _systemNotificationsService.notify("New inbox message", "You got new message on the inbox " + inboxUrl);
      }
    };
  }

  private onopenCallback = function (inboxUrl: string, _snackBar: MatSnackBar, connectNew: boolean) {
    return function () {
      this.send('sub ' + inboxUrl);
      console.log("subscribed to ", inboxUrl);
      if (connectNew) _snackBar.open("Successfully added inbox url to monitor: " + inboxUrl, "Dismiss");
    }
  }
}
