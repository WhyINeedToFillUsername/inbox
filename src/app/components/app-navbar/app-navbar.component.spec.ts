import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNavbarComponent } from './app-navbar.component';
import {Overlay} from "@angular/cdk/overlay";
import {MatSnackBar} from "@angular/material/snack-bar";

describe('AppNavbarComponent', () => {
  let component: AppNavbarComponent;
  let fixture: ComponentFixture<AppNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppNavbarComponent ],
      providers: [MatSnackBar, Overlay]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
