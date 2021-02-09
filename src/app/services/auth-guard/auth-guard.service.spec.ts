import {TestBed} from '@angular/core/testing';

import {AuthGuardService} from './auth-guard.service';
import {Overlay} from "@angular/cdk/overlay";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RouterTestingModule} from "@angular/router/testing";

describe('AuthService', () => {
  let service: AuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [MatSnackBar, Overlay]
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
