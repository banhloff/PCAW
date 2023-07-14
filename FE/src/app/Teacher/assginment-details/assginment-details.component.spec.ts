import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssginmentDetailsComponent } from './assginment-details.component';

describe('AssginmentDetailsComponent', () => {
  let component: AssginmentDetailsComponent;
  let fixture: ComponentFixture<AssginmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssginmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssginmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
