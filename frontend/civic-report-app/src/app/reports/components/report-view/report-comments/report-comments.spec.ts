import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComments } from './report-comments';

describe('ReportComments', () => {
  let component: ReportComments;
  let fixture: ComponentFixture<ReportComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportComments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
