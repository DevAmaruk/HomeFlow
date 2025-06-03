import { TestBed } from '@angular/core/testing';

import { ChoreCategoryService } from './chore-category.service';

describe('ChoreCategoryService', () => {
  let service: ChoreCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoreCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
