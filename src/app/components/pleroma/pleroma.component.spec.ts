import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PleromaComponent} from './pleroma.component';
import {ActivatedRoute} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";

describe('PleromaComponent', () => {
  let component: PleromaComponent;
  let fixture: ComponentFixture<PleromaComponent>;

  const fakeQueryMap = {
    queryParamMap: of({
      get: () => {
        return "asdf"
      }
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PleromaComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        HttpClient,
        {provide: ActivatedRoute, useValue: fakeQueryMap}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PleromaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
