import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTabs } from './report-tabs';

describe('ReportTabs', () => {
  let component: ReportTabs;
  let fixture: ComponentFixture<ReportTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
