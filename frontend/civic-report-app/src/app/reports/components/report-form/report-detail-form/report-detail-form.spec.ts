import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailForm } from './report-detail-form';

describe('ReportDetailForm', () => {
  let component: ReportDetailForm;
  let fixture: ComponentFixture<ReportDetailForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDetailForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
