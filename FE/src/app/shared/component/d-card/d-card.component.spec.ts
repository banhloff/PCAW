import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DCardComponent } from './d-card.component';

describe('DCardComponent', () => {
  let component: DCardComponent;
  let fixture: ComponentFixture<DCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
