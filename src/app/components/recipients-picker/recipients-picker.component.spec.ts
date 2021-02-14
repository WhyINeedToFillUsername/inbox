import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientsPickerComponent } from './recipients-picker.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('RecipientsPickerComponent', () => {
  let component: RecipientsPickerComponent;
  let fixture: ComponentFixture<RecipientsPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatAutocompleteModule],
      declarations: [ RecipientsPickerComponent ],
      providers: [MatSnackBar, Overlay]
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
