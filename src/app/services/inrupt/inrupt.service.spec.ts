import { TestBed } from '@angular/core/testing';

import { InruptService } from './inrupt.service';

describe('InruptService', () => {
  let service: InruptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InruptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
