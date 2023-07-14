import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAccountTeacherComponent } from './request-account-teacher.component';

describe('RequestAccountTeacherComponent', () => {
  let component: RequestAccountTeacherComponent;
  let fixture: ComponentFixture<RequestAccountTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestAccountTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAccountTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
