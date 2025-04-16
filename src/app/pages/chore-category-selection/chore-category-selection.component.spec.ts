import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreCategorySelectionComponent } from './chore-category-selection.component';

describe('ChoreCategorySelectionComponent', () => {
  let component: ChoreCategorySelectionComponent;
  let fixture: ComponentFixture<ChoreCategorySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoreCategorySelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoreCategorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
