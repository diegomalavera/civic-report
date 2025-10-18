import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStatusForm } from './report-status-form';

describe('ReportStatusForm', () => {
  let component: ReportStatusForm;
  let fixture: ComponentFixture<ReportStatusForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportStatusForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportStatusForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
