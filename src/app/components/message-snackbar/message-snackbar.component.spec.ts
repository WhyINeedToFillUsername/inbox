import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSnackbarComponent } from './message-snackbar.component';

describe('MessageSnackbarComponent', () => {
  let component: MessageSnackbarComponent;
  let fixture: ComponentFixture<MessageSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
