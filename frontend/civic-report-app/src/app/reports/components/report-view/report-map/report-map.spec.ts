import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMap } from './report-map';

describe('ReportMap', () => {
  let component: ReportMap;
  let fixture: ComponentFixture<ReportMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
