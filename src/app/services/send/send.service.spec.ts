import { TestBed } from '@angular/core/testing';

import { SendService } from './send.service';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";

describe('SendService', () => {
  let service: SendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MatSnackBar, Overlay],
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(SendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
