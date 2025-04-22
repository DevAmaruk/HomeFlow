import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreHomepageComponent } from './chore-homepage.component';

describe('ChoreHomepageComponent', () => {
  let component: ChoreHomepageComponent;
  let fixture: ComponentFixture<ChoreHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoreHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoreHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
