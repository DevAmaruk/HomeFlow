import { TestBed } from '@angular/core/testing';

import { FamillyService } from './familly.service';

describe('FamillyService', () => {
  let service: FamillyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamillyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
