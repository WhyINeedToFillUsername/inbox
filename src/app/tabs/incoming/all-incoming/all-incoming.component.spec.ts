import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIncomingComponent } from './all-incoming.component';

describe('AllIncomingComponent', () => {
  let component: AllIncomingComponent;
  let fixture: ComponentFixture<AllIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllIncomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
