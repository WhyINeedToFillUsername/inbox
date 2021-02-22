import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorInboxesComponent } from './monitor-inboxes.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";

describe('MonitorInboxesComponent', () => {
  let component: MonitorInboxesComponent;
  let fixture: ComponentFixture<MonitorInboxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ MonitorInboxesComponent ],
      providers: [MatSnackBar, Overlay]
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
