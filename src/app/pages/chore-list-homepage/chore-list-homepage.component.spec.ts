import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreListHomepageComponent } from './chore-list-homepage.component';

describe('ChoreListHomepageComponent', () => {
  let component: ChoreListHomepageComponent;
  let fixture: ComponentFixture<ChoreListHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoreListHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoreListHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
