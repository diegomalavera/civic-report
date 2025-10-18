import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMapForm } from './report-map-form';

describe('ReportMapForm', () => {
  let component: ReportMapForm;
  let fixture: ComponentFixture<ReportMapForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMapForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportMapForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
