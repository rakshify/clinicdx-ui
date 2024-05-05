import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientVisitsPage } from './patient-visits.page';

describe('PatientVisitsPage', () => {
  let component: PatientVisitsPage;
  let fixture: ComponentFixture<PatientVisitsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PatientVisitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
