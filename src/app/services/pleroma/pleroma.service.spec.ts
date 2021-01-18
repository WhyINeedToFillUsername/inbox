import { TestBed } from '@angular/core/testing';

import { PleromaService } from './pleroma.service';
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('PleromaService', () => {
  let service: PleromaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(PleromaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
