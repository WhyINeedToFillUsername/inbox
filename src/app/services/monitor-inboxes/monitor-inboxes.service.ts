import {Injectable} from '@angular/core';
import {BrowserStorageService} from "../browser-storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class MonitorInboxesService {

  public static readonly MONITORED_INBOXES_STORAGE_KEY: string = "MONITORED_INBOXES_STORAGE_KEY";

  constructor(private readonly _snackBar: MatSnackBar) {
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
    let socket = new WebSocket(MonitorInboxesService.getWsUrlFromInboxUrl(inboxUrl), 'solid.0.1.0-alpha'); //solid/0.1.0-alpha
    socket.onopen = this.onopenCallback(inboxUrl, this._snackBar, connectNew);
    socket.onmessage = this.onmessageCallback(inboxUrl, this._snackBar);
  }

  static getWsUrlFromInboxUrl(inboxUrl: string) {
    const urlParts = new URL(inboxUrl).hostname.split('.')

    const urlWithoutSubdomain = urlParts
      .slice(0)
      .slice(-(urlParts.length === 4 ? 3 : 2))
      .join('.');
    return "wss://" + urlWithoutSubdomain + "/";
  }

  private onmessageCallback = function (inboxUrl: string, _snackBar: MatSnackBar) {
    return function (msg) {
      console.log("message:", msg);
      if (msg.data && msg.data.slice(0, 3) === 'pub') {
        // resource updated, refetch resource
        _snackBar.open("You got new message on the inbox " + inboxUrl, "Dismiss");
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
