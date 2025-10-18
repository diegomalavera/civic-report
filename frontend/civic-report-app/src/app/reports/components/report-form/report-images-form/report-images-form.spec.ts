import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportImagesForm } from './report-images-form';

describe('ReportImagesForm', () => {
  let component: ReportImagesForm;
  let fixture: ComponentFixture<ReportImagesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportImagesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportImagesForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
