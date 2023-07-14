import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditTeacherComponent } from './dialog-edit-teacher.component';

describe('DialogEditTeacherComponent', () => {
  let component: DialogEditTeacherComponent;
  let fixture: ComponentFixture<DialogEditTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
