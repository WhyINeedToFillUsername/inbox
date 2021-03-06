import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDetailComponent } from './message-detail.component';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {RouterTestingModule} from "@angular/router/testing";

describe('MessageDetailComponent', () => {
  let component: MessageDetailComponent;
  let fixture: ComponentFixture<MessageDetailComponent>;

  const fakeQueryMap = {
    params: of(['inboxUrl', 'messageId'])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ MessageDetailComponent ],
      providers: [
        MatSnackBar, Overlay, HttpClient, HttpHandler,
        {provide: ActivatedRoute, useValue: fakeQueryMap}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
