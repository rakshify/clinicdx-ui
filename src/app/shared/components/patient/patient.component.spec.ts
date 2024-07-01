import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientComponent } from './patient.component';
import { IPatient } from '../../../core/interfaces/patient';

describe('PatientComponent', () => {
  let component: PatientComponent;
  let fixture: ComponentFixture<PatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an undefined patient by default', () => {
    expect(component.patient).toBeUndefined();
  });

  it('should accept a patient input', () => {
    const testPatient: IPatient = {
      patient_id: '1',
      name: 'John Doe',
      gender: 'Male',
      age: 30,
      phoneNumber: '1234567890',
      email: 'john@example.com',
      address: '123 Main St'
    };
    component.patient = testPatient;
    expect(component.patient).toEqual(testPatient);
  });
});