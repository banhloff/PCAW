import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogClassesComponent } from './dialog-classes.component';

describe('DialogClassesComponent', () => {
  let component: DialogClassesComponent;
  let fixture: ComponentFixture<DialogClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogClassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
