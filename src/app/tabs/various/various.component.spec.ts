import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariousComponent } from './various.component';

describe('VariousComponent', () => {
  let component: VariousComponent;
  let fixture: ComponentFixture<VariousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariousComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
