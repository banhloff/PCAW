import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassImportComponent } from './class-import.component';

describe('ClassImportComponent', () => {
  let component: ClassImportComponent;
  let fixture: ComponentFixture<ClassImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
