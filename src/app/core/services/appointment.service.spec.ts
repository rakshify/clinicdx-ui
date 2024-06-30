import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentService } from './appointment.service';
import { IAppointment } from '../interfaces/appointment';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentService]
    });
    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get doctor appointments', async () => {
    const mockAppointments: IAppointment[] = [
      { 
        patientId: '1', 
        patientName: 'John Doe', 
        gender: 'Male', 
        age: 30, 
        phoneNumber: '1234567890', 
        complain: 'Headache', 
        consultDoctor: 'Dr. Smith', 
        consultDoctorName: 'Dr. Smith', 
        consultDoctorSpeciality: 'General', 
        aptType: 'Regular', 
        aptAt: new Date() 
      }
    ];

    const clientId = 'client1';
    const doctorId = 'doctor1';
    const page = 1;
    const limit = 10;

    service.getDoctorAppointments(clientId, doctorId, page, limit).then(appointments => {
      expect(appointments).toEqual(mockAppointments);
    });

    const req = httpMock.expectOne(`http://localhost:3000/appointments?clientId=${clientId}&doctorId=${doctorId}&_page=${page}&_limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointments);
  });

  it('should return empty array when response is null', async () => {
    const clientId = 'client1';
    const doctorId = 'doctor1';
    const page = 1;
    const limit = 10;

    service.getDoctorAppointments(clientId, doctorId, page, limit).then(appointments => {
      expect(appointments).toEqual([]);
    });

    const req = httpMock.expectOne(`http://localhost:3000/appointments?clientId=${clientId}&doctorId=${doctorId}&_page=${page}&_limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });
});