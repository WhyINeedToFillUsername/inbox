import { TestBed } from '@angular/core/testing';

import { SystemNotificationsService } from './system-notifications.service';

describe('SystemNotificationsService', () => {
  let service: SystemNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
