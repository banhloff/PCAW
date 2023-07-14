import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlagiarismStudentComponent } from './view-plagiarism-student.component';

describe('ViewPlagiarismStudentComponent', () => {
  let component: ViewPlagiarismStudentComponent;
  let fixture: ComponentFixture<ViewPlagiarismStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPlagiarismStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPlagiarismStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
