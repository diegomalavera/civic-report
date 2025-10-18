import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateEmail } from './validate-email';

describe('ValidateEmail', () => {
  let component: ValidateEmail;
  let fixture: ComponentFixture<ValidateEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
