import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTaskCreationComponent } from './custom-task-creation.component';

describe('CustomTaskCreationComponent', () => {
  let component: CustomTaskCreationComponent;
  let fixture: ComponentFixture<CustomTaskCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTaskCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomTaskCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
