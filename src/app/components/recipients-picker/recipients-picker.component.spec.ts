import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientsPickerComponent } from './recipients-picker.component';

describe('RecipientsPickerComponent', () => {
  let component: RecipientsPickerComponent;
  let fixture: ComponentFixture<RecipientsPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipientsPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientsPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
