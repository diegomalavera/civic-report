import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportImages } from './report-images';

describe('ReportImages', () => {
  let component: ReportImages;
  let fixture: ComponentFixture<ReportImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportImages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportImages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
