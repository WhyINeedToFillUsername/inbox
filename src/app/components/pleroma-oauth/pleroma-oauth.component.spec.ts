import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PleromaOAuthComponent } from './pleroma-oauth.component';

describe('PleromaOAuthComponent', () => {
  let component: PleromaOAuthComponent;
  let fixture: ComponentFixture<PleromaOAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PleromaOAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PleromaOAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
