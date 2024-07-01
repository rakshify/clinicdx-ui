import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from '../../core/services/auth.service';
import { IUser } from '../../core/interfaces/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkUsername', () => {
    it('should check username availability', async () => {
      const mockResponse = { available: true, message: 'Username available' };
      const username = 'testuser';

      const result = service.checkUsername(username);

      const req = httpMock.expectOne(`http://localhost:3000/check-username?username=${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      await expectAsync(result).toBeResolvedTo(mockResponse);
    });

    it('should handle error when checking username', async () => {
      const username = 'testuser';
      const errorResponse = new ErrorEvent('Network error', {
        message: 'simulated network error',
      });

      const result = service.checkUsername(username);

      const req = httpMock.expectOne(`http://localhost:3000/check-username?username=${username}`);
      req.error(errorResponse);

      await expectAsync(result).toBeRejected();
    });
  });

  describe('submitRegistration', () => {
    it('should submit registration data', async () => {
      const mockUser: IUser = {
        fname: 'John',
        lname: 'Doe',
        username: 'johndoe',
        gender: 'Male',
        age: 30,
        phoneNumber: '1234567890',
        email: 'john@example.com'
      };
      const mockResponse = { success: true };

      const result = service.submitRegistration(mockUser);

      const req = httpMock.expectOne('http://localhost:3000/signup');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
      req.flush(mockResponse);

      await expectAsync(result).toBeResolvedTo(mockResponse);
    });

    it('should handle error when submitting registration', async () => {
      const mockUser: IUser = {
        fname: 'John',
        lname: 'Doe',
        username: 'johndoe',
        gender: 'Male',
        age: 30,
        phoneNumber: '1234567890',
        email: 'john@example.com'
      };
      const errorResponse = new ErrorEvent('Network error', {
        message: 'simulated network error',
      });

      const result = service.submitRegistration(mockUser);

      const req = httpMock.expectOne('http://localhost:3000/signup');
      req.error(errorResponse);

      await expectAsync(result).toBeRejected();
    });
  });
});