import { TestBed } from '@angular/core/testing';

import { EmdrService } from './emdr.service';

describe('EmdrService', () => {
  let service: EmdrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmdrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
