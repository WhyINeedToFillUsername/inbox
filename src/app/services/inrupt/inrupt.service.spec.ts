import { TestBed } from '@angular/core/testing';

import { InruptService } from './inrupt.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";

describe('InruptService', () => {
  let service: InruptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatSnackBar, Overlay],
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(InruptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
