import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomaCategoriesComponent } from './diploma-categories.component';

describe('DiplomaCategoriesComponent', () => {
  let component: DiplomaCategoriesComponent;
  let fixture: ComponentFixture<DiplomaCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiplomaCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiplomaCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
