import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishDiplomaComponent } from './finish-diploma.component';

describe('FinishDiplomaComponent', () => {
  let component: FinishDiplomaComponent;
  let fixture: ComponentFixture<FinishDiplomaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishDiplomaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishDiplomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
