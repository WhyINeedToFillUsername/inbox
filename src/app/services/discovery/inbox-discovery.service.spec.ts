import { TestBed } from '@angular/core/testing';

import { InboxDiscoveryService } from './inbox-discovery.service';

describe('InboxDiscoveryService', () => {
  let service: InboxDiscoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InboxDiscoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
