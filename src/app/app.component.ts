import {Component} from '@angular/core';
import {MonitorInboxesService} from "./services/monitor-inboxes/monitor-inboxes.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inbox';

  constructor(private readonly _monitorInboxesService: MonitorInboxesService) {
    _monitorInboxesService.startMonitoring();
  }
}
