import { TestBed } from '@angular/core/testing';

import { MonitorInboxesService } from './monitor-inboxes.service';

describe('MonitorInboxesService', () => {
  let service: MonitorInboxesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorInboxesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
