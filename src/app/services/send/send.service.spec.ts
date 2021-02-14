import { TestBed } from '@angular/core/testing';

import { SendService } from './send.service';

describe('SendService', () => {
  let service: SendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
