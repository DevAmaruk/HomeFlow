import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreTaskSelectionComponent } from './chore-task-selection.component';

describe('ChoreTaskSelectionComponent', () => {
  let component: ChoreTaskSelectionComponent;
  let fixture: ComponentFixture<ChoreTaskSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoreTaskSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoreTaskSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
