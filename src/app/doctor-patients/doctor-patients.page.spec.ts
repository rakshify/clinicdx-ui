import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { PatientService } from '../core/services/patient.service';
import { AuthService } from '../core/services/auth.service';
import { IPatient } from '../core/interfaces/patient';
import { IUserProfile } from '../core/interfaces/user';
import { DoctorPatientsPage } from './doctor-patients.page';

describe('DoctorPatientsPage', () => {
  let component: DoctorPatientsPage;
  let fixture: ComponentFixture<DoctorPatientsPage>;
  let patientServiceSpy: jasmine.SpyObj<PatientService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser: IUserProfile = {
    id: 'doctor123',
    name: 'Dr. Smith',
    clientId: 'client456',
    roles: ['doctor'],
  };

  const mockPatients: IPatient[] = Array(15).fill(null).map((_, index) => ({
    patient_id: `${index + 1}`,
    name: `Patient ${index + 1}`,
    gender: index % 2 === 0 ? 'Male' : 'Female',
    age: 20 + index,
    phoneNumber: `123456789${index}`
  }));

  beforeEach(async () => {
    const patientSpy = jasmine.createSpyObj('PatientService', ['getDoctorPatients']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [DoctorPatientsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: PatientService, useValue: patientSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    patientServiceSpy = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture = TestBed.createComponent(DoctorPatientsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty patients array', () => {
    expect(component.patients).toEqual([]);
  });

  it('should load patients on init', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    patientServiceSpy.getDoctorPatients.and.returnValue(Promise.resolve(mockPatients));

    component.ngOnInit();
    tick();

    expect(component.patients).toEqual(mockPatients);
    expect(component.page).toBe(2);
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(patientServiceSpy.getDoctorPatients).toHaveBeenCalledWith(
      mockUser.clientId || '',
      mockUser.id,
      1,
      10
    );
  }));

  it('should not load patients if user is not authenticated', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(null);

    component.ngOnInit();
    tick();

    expect(component.patients).toEqual([]);
    expect(patientServiceSpy.getDoctorPatients).not.toHaveBeenCalled();
  }));

  it('should load more patients when scrolling', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    patientServiceSpy.getDoctorPatients.and.returnValue(Promise.resolve(mockPatients.slice(0, 10)));
  
    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };
  
    component.patients = [];
    component.page = 1;
  
    component.loadPatients(mockEvent);
    tick();
  
    expect(component.patients.length).toBe(10);
    expect(component.page).toBe(2);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(false);
  }));

  it('should disable infinite scroll when reaching the end of the patient list', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    patientServiceSpy.getDoctorPatients.and.returnValue(Promise.resolve(mockPatients.slice(10)));
  
    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };
  
    component.patients = mockPatients.slice(0, 10);
    component.page = 2;
  
    component.loadPatients(mockEvent);
    tick();
  
    expect(component.patients.length).toBe(15);
    expect(component.page).toBe(3);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(true);
  }));
  
  // Add a new test for when fewer patients are returned than the limit
  it('should disable infinite scroll when fewer patients are returned than the limit', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    const fewerPatients = mockPatients.slice(0, 1); // Only return one patient
    patientServiceSpy.getDoctorPatients.and.returnValue(Promise.resolve(fewerPatients));
  
    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };
  
    component.patients = mockPatients.slice(0, 15); // Start with 15 patients
    component.page = 2;
  
    component.loadPatients(mockEvent);
    tick();
  
    expect(component.patients.length).toBe(16); // 15 initial + 1 new
    expect(component.page).toBe(3);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(true);
  }));

  it('should disable infinite scroll when no more patients', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    patientServiceSpy.getDoctorPatients.and.returnValue(Promise.resolve([]));
  
    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
        disabled: false,
      },
    };
  
    component.patients = mockPatients;
    component.page = 2;
  
    component.loadPatients(mockEvent);
    tick();
  
    expect(component.patients.length).toBe(15);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(mockEvent.target.disabled).toBe(true);
  }));

  it('should handle loadPatients without event', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    patientServiceSpy.getDoctorPatients.and.returnValue(Promise.resolve(mockPatients));

    component.loadPatients();
    tick();

    expect(component.patients).toEqual(mockPatients);
    expect(component.page).toBe(2);
  }));
});