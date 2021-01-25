import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SendMessageComponent} from './send-message.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('SendMessageComponent', () => {
  let component: SendMessageComponent;
  let fixture: ComponentFixture<SendMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendMessageComponent],
      imports: [HttpClientTestingModule],
      providers: [MatSnackBar, Overlay]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
