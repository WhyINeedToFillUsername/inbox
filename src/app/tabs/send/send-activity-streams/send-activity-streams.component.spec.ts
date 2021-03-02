import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendActivityStreamsComponent } from './send-activity-streams.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('SendActivityStreamsComponent', () => {
  let component: SendActivityStreamsComponent;
  let fixture: ComponentFixture<SendActivityStreamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendActivityStreamsComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MatSnackBar, Overlay],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendActivityStreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
