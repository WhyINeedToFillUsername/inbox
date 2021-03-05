import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorInboxesComponent } from './monitor-inboxes.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('MonitorInboxesComponent', () => {
  let component: MonitorInboxesComponent;
  let fixture: ComponentFixture<MonitorInboxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorInboxesComponent ],
      providers: [MatSnackBar, Overlay, HttpClient, HttpHandler],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorInboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
