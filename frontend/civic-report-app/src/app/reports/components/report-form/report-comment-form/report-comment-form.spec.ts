import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCommentForm } from './report-comment-form';

describe('ReportCommentForm', () => {
  let component: ReportCommentForm;
  let fixture: ComponentFixture<ReportCommentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCommentForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCommentForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
