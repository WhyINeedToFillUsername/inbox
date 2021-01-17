import {Component, OnInit} from '@angular/core';
import {MonitorInboxesService} from "../../services/monitor-inboxes/monitor-inboxes.service";

@Component({
  selector: 'app-monitor-inboxes',
  templateUrl: './monitor-inboxes.component.html',
  styleUrls: ['./monitor-inboxes.component.css']
})
export class MonitorInboxesComponent implements OnInit {
  inboxUrl: string = "";
  monitoredInboxes: string[];

  constructor(private readonly _monitorInboxesService: MonitorInboxesService) {
  }

  ngOnInit(): void {
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
  }

  startMonitoring() {
    this._monitorInboxesService.addInboxToMonitor(this.inboxUrl);
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
  }

  stopMonitoring(inboxUrl: string) {
    this._monitorInboxesService.removeInboxFromMonitored(inboxUrl);
    this.monitoredInboxes = this._monitorInboxesService.getMonitoredInboxes();
  }
}
