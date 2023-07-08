import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDiplomasComponent } from './manage-diplomas.component';

describe('ManageDiplomasComponent', () => {
  let component: ManageDiplomasComponent;
  let fixture: ComponentFixture<ManageDiplomasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDiplomasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDiplomasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
