import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PleromaComponent } from './pleroma.component';

describe('PleromaComponent', () => {
  let component: PleromaComponent;
  let fixture: ComponentFixture<PleromaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PleromaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PleromaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
