import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SendComponent} from './send.component';

describe('SendComponent', () => {
  let component: SendComponent;
  let fixture: ComponentFixture<SendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendComponent);
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
