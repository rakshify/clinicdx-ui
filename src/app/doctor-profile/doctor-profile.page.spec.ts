import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppointmentService } from '../core/services/appointment.service';
import { AuthService } from '../core/services/auth.service';
import { IAppointment } from '../core/interfaces/appointment';
import { IUserProfile } from '../core/interfaces/user';
import { DoctorProfilePage } from './doctor-profile.page';

describe('DoctorProfilePage', () => {
  let component: DoctorProfilePage;
  let fixture: ComponentFixture<DoctorProfilePage>;
  let appointmentServiceSpy: jasmine.SpyObj<AppointmentService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser: IUserProfile = {
    id: 'doctor123',
    name: 'Dr. Smith',
    clientId: 'client456',
    roles: ['doctor'],
  };

  const createMockAppointment = (id: number): IAppointment => ({
    id: `apt${id}`,
    patientId: `patient${id}`,
    patientName: `Patient ${id}`,
    gender: id % 2 === 0 ? 'Male' : 'Female',
    age: 20 + (id % 40),
    phoneNumber: `123456789${id}`,
    complain: `Complain ${id}`,
    consultDoctor: 'doctor123',
    consultDoctorName: 'Dr. Smith',
    consultDoctorSpeciality: 'General',
    aptType: 'Regular',
    aptAt: new Date(),
  });

  const mockAppointments: IAppointment[] = Array.from(
    { length: 25 }, (_, i) => createMockAppointment(i + 1));

  beforeEach(async () => {
    appointmentServiceSpy = jasmine.createSpyObj('AppointmentService', ['getDoctorAppointments']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [DoctorProfilePage],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorProfilePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty appointments', () => {
    expect(component.appointments).toEqual([]);
    expect(component.page).toBe(1);
    expect(component.limit).toBe(10);
  });

  it('should load appointments on init', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve(mockAppointments));

    fixture.detectChanges();
    tick();

    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(appointmentServiceSpy.getDoctorAppointments).toHaveBeenCalledWith(
      mockUser.clientId || '',
      mockUser.id,
      1,
      10
    );
    expect(component.appointments).toEqual(mockAppointments);
    expect(component.page).toBe(2);
  }));

  it('should not load appointments if user is not available', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(null);

    fixture.detectChanges();
    tick();

    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(appointmentServiceSpy.getDoctorAppointments).not.toHaveBeenCalled();
    expect(component.appointments).toEqual([]);
    expect(component.page).toBe(1);
  }));

  it('should load more appointments when loadAppointments is called with an event', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve(mockAppointments));

    component.appointments = [...mockAppointments];
    component.page = 2;

    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };

    component.loadAppointments(mockEvent);
    tick();

    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(appointmentServiceSpy.getDoctorAppointments).toHaveBeenCalledWith(
      mockUser.clientId || '',
      mockUser.id,
      2,
      10
    );
    expect(component.appointments.length).toBe(mockAppointments.length * 2);
    expect(component.page).toBe(3);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(false);
  }));

  it('should disable infinite scroll when no more appointments are available', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve([]));

    component.appointments = [...mockAppointments];
    component.page = 2;

    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };

    component.loadAppointments(mockEvent);
    tick();

    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(appointmentServiceSpy.getDoctorAppointments).toHaveBeenCalledWith(
      mockUser.clientId || '',
      mockUser.id,
      2,
      10
    );
    expect(component.appointments.length).toBe(mockAppointments.length);
    expect(component.page).toBe(3);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(true);
  }));

  it('should load more appointments when scrolling', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve(mockAppointments.slice(0, 10)));

    component.ngOnInit();
    tick();

    expect(component.appointments.length).toBe(10);
    expect(component.page).toBe(2);

    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };

    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve(mockAppointments.slice(10, 20)));

    component.loadAppointments(mockEvent);
    tick();

    expect(component.appointments.length).toBe(20);
    expect(component.page).toBe(3);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(false);
  }));

  it('should disable infinite scroll when reaching the end of the appointment list', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve(mockAppointments.slice(0, 10)));
  
    component.ngOnInit();
    tick();
  
    expect(component.appointments.length).toBe(10);
    expect(component.page).toBe(2);
  
    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };
  
    // Return the last 9 appointments (less than the limit of 10)
    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve(mockAppointments.slice(16, 25)));
  
    component.loadAppointments(mockEvent);
    tick();
  
    expect(component.appointments.length).toBe(19); // 10 initial + 9 new
    expect(component.page).toBe(3);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(true);
  }));

  it('should disable infinite scroll when no more appointments', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve(mockAppointments.slice(0, 10)));

    component.ngOnInit();
    tick();

    expect(component.appointments.length).toBe(10);
    expect(component.page).toBe(2);

    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };

    appointmentServiceSpy.getDoctorAppointments.and.returnValue(Promise.resolve([]));

    component.loadAppointments(mockEvent);
    tick();

    expect(component.appointments.length).toBe(10); // No new appointments added
    expect(component.page).toBe(3);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(true);
  }));
});