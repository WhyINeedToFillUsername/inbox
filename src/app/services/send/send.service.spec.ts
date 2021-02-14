import { TestBed } from '@angular/core/testing';

import { SendService } from './send.service';
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('SendService', () => {
  let service: SendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(SendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
