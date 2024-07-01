import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { ISpecialty, IDoctor } from '../interfaces'; // Assume these are in a separate file

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHospitalSpecialties', () => {
    it('should return an array of specialties', async () => {
      const mockSpecialties: ISpecialty[] = [
        { id: '1', name: 'Cardiology', clientId: 'c1', hospitalId: 'h1' },
        { id: '2', name: 'Neurology', clientId: 'c1', hospitalId: 'h1' }
      ];

      const result = service.getHospitalSpecialties();

      const req = httpMock.expectOne('http://localhost:3000/get-hospital-specialities');
      expect(req.request.method).toBe('GET');
      req.flush(mockSpecialties);

      await expectAsync(result).toBeResolvedTo(mockSpecialties);
    });

    it('should handle errors', async () => {
      const result = service.getHospitalSpecialties();

      const req = httpMock.expectOne('http://localhost:3000/get-hospital-specialities');
      req.error(new ErrorEvent('Network error'));

      await expectAsync(result).toBeRejected();
    });
  });

  describe('getSpecialityDoctors', () => {
    it('should return an array of doctors for a given specialty', async () => {
      const specialtyId = '1';
      const mockDoctors: IDoctor[] = [
        { id: 'd1', name: 'Dr. Smith', specialtyId: '1', specialty: 'Cardiology', hospitalId: 'h1' },
        { id: 'd2', name: 'Dr. Johnson', specialtyId: '1', specialty: 'Cardiology', hospitalId: 'h1' }
      ];

      const result = service.getSpecialityDoctors(specialtyId);

      const req = httpMock.expectOne(`http://localhost:3000/get-speciality-doctors?specialityId=${specialtyId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDoctors);

      await expectAsync(result).toBeResolvedTo(mockDoctors);
    });

    it('should handle errors', async () => {
      const specialtyId = '1';
      const result = service.getSpecialityDoctors(specialtyId);

      const req = httpMock.expectOne(`http://localhost:3000/get-speciality-doctors?specialityId=${specialtyId}`);
      req.error(new ErrorEvent('Network error'));

      await expectAsync(result).toBeRejected();
    });

    // it('should encode the specialtyId in the URL', async () => {
    //   const specialtyId = 'spec 1';
    //   service.getSpecialityDoctors(specialtyId);

    //   const req = httpMock.expectOne(`http://localhost:3000/get-speciality-doctors?specialityId=spec%201`);
    //   expect(req.request.method).toBe('GET');
    //   req.flush([]);
    // });
  });
});