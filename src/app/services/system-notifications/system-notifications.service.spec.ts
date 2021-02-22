import { TestBed } from '@angular/core/testing';

import { SystemNotificationsService } from './system-notifications.service';
import {RouterTestingModule} from "@angular/router/testing";

describe('SystemNotificationsService', () => {
  let service: SystemNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(SystemNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
