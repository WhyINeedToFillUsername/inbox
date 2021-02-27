import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTabNavComponent } from './send-tab-nav.component';

describe('SendTabNavComponent', () => {
  let component: SendTabNavComponent;
  let fixture: ComponentFixture<SendTabNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendTabNavComponent ]
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
