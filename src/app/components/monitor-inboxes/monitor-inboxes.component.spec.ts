import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorInboxesComponent } from './monitor-inboxes.component';

describe('MonitorInboxesComponent', () => {
  let component: MonitorInboxesComponent;
  let fixture: ComponentFixture<MonitorInboxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorInboxesComponent ]
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
