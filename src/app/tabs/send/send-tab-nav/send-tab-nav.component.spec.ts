import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SendTabNavComponent} from './send-tab-nav.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";

describe('SendTabNavComponent', () => {
  let component: SendTabNavComponent;
  let fixture: ComponentFixture<SendTabNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendTabNavComponent],
      providers: [MatSnackBar, Overlay],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTabNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
