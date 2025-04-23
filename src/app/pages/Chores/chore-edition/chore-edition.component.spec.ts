import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreEditionComponent } from './chore-edition.component';

describe('ChoreEditionComponent', () => {
  let component: ChoreEditionComponent;
  let fixture: ComponentFixture<ChoreEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoreEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoreEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
