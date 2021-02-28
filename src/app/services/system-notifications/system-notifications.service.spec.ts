import { TestBed } from '@angular/core/testing';

import { SystemNotificationsService } from './system-notifications.service';
import {RouterTestingModule} from "@angular/router/testing";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";

describe('SystemNotificationsService', () => {
  let service: SystemNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatSnackBar, Overlay],
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(SystemNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
