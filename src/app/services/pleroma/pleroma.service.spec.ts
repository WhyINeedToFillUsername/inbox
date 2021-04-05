import { TestBed } from '@angular/core/testing';

import { PleromaService } from './pleroma.service';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {APP_BASE_HREF, PlatformLocation} from "@angular/common";

describe('PleromaService', () => {
  let service: PleromaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, {provide: APP_BASE_HREF, useValue: "/"}]
    });
    service = TestBed.inject(PleromaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
