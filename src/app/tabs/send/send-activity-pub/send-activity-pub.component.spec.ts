import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendActivityPubComponent } from './send-activity-pub.component';

describe('SendActivityPubComponent', () => {
  let component: SendActivityPubComponent;
  let fixture: ComponentFixture<SendActivityPubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendActivityPubComponent ]
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
