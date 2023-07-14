import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditStudentComponent } from './dialog-edit-student.component';

describe('DialogEditStudentComponent', () => {
  let component: DialogEditStudentComponent;
  let fixture: ComponentFixture<DialogEditStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
