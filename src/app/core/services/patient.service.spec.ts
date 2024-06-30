import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientService } from './patient.service';
import { IPatient } from '../interfaces/patient';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService]
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get doctor patients', async () => {
    const mockPatients: IPatient[] = [
      { patient_id: '1', name: 'John Doe', gender: 'Male', age: 30, phoneNumber: '1234567890' }
    ];

    const clientId = 'client1';
    const doctorId = 'doctor1';
    const page = 1;
    const limit = 10;

    service.getDoctorPatients(clientId, doctorId, page, limit).then(patients => {
      expect(patients).toEqual(mockPatients);
    });

    const req = httpMock.expectOne(`http://localhost:3000/patients?clientId=${clientId}&doctorId=${doctorId}&_page=${page}&_limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPatients);
  });

  it('should return empty array when response is null', async () => {
    const clientId = 'client1';
    const doctorId = 'doctor1';
    const page = 1;
    const limit = 10;

    service.getDoctorPatients(clientId, doctorId, page, limit).then(patients => {
      expect(patients).toEqual([]);
    });

    const req = httpMock.expectOne(`http://localhost:3000/patients?clientId=${clientId}&doctorId=${doctorId}&_page=${page}&_limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });
});