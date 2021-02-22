import {TestBed} from '@angular/core/testing';
import {MonitorInboxesService} from './monitor-inboxes.service';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";

describe('MonitorInboxesService', () => {
  let service: MonitorInboxesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatSnackBar, Overlay],
      imports: [MatSnackBarModule, RouterTestingModule],
    }).compileComponents();

    service = TestBed.inject(MonitorInboxesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get correct WS URL from inbox URL', () => {
    const wsUrlFromInboxUrl = MonitorInboxesService.getWsUrlFromInboxUrl('https://tonda.solidcommunity.net/inbox/');
    expect(wsUrlFromInboxUrl).toEqual("wss://solidcommunity.net/");
  });
});
