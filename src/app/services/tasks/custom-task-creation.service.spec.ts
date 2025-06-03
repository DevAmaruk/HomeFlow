import { TestBed } from '@angular/core/testing';

import { CustomTaskCreationService } from './custom-task-creation.service';

describe('CustomTaskCreationService', () => {
  let service: CustomTaskCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTaskCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
