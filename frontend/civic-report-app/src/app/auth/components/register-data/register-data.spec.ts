import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterData } from './register-data';

describe('RegisterData', () => {
  let component: RegisterData;
  let fixture: ComponentFixture<RegisterData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
