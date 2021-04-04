import {TestBed} from '@angular/core/testing';

import {AuthGuardService} from './auth-guard.service';
import {Overlay} from "@angular/cdk/overlay";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {InruptService} from "../inrupt/inrupt.service";

describe('AuthService', () => {
  let service: AuthGuardService;
  const mockRouter = {parseUrl: jasmine.createSpy('parseUrl')};
  const mockInruptService = {isLoggedIn: jasmine.createSpy('isLoggedIn')};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [MatSnackBar, Overlay, {provide: Router, useValue: mockRouter}, {provide: InruptService, useValue: mockInruptService}]
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('cannot navigate without login', () => {
    mockInruptService.isLoggedIn.and.returnValue(false);
    expect(service.canActivate()).toBeFalsy();
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
  });

  it('can navigate with login', () => {
    mockInruptService.isLoggedIn.and.returnValue(true);
    expect(service.canActivate()).toBeTruthy();
  });
});
