import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SendSimpleComponent} from './send-simple.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";

describe('SendSimpleComponent', () => {
  let component: SendSimpleComponent;
  let fixture: ComponentFixture<SendSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendSimpleComponent ],
      providers: [MatSnackBar, Overlay, HttpClient, HttpHandler],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* TCs:
  - send message to 1 recipient
  - send message to multiple recipients
  - error sending message
  - error with form - no inbox discovered
  */
});
