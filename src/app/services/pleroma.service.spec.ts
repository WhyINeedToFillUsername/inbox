import { TestBed } from '@angular/core/testing';

import { PleromaService } from './pleroma.service';

describe('PleromaService', () => {
  let service: PleromaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PleromaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
