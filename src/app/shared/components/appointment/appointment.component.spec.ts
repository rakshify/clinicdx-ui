import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentComponent } from './appointment.component';
import { IAppointment } from '../../../core/interfaces/appointment';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an undefined appointment by default', () => {
    expect(component.appointment).toBeUndefined();
  });

  it('should accept an appointment input', () => {
    const testAppointment: IAppointment = {
      patientId: '1',
      patientName: 'John Doe',
      gender: 'Male',
      age: 30,
      phoneNumber: '1234567890',
      complain: 'Headache',
      consultDoctor: 'dr1',
      consultDoctorName: 'Dr. Smith',
      consultDoctorSpeciality: 'General',
      aptType: 'Regular',
      aptAt: new Date()
    };
    component.appointment = testAppointment;
    expect(component.appointment).toEqual(testAppointment);
  });
});