import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InruptComponent } from './inrupt.component';

describe('InruptComponent', () => {
  let component: InruptComponent;
  let fixture: ComponentFixture<InruptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InruptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InruptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
