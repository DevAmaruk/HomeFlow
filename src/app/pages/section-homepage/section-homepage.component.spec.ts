import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHomepageComponent } from './section-homepage.component';

describe('SectionHomepageComponent', () => {
  let component: SectionHomepageComponent;
  let fixture: ComponentFixture<SectionHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
