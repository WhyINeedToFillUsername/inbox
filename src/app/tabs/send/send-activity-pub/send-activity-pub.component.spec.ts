import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendActivityPubComponent } from './send-activity-pub.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('SendActivityPubComponent', () => {
  let component: SendActivityPubComponent;
  let fixture: ComponentFixture<SendActivityPubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendActivityPubComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MatSnackBar, Overlay],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendActivityPubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
