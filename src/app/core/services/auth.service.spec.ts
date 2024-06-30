import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { FormGroup, FormControl } from '@angular/forms';

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
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', fakeAsync(() => {
    const mockResponse = { token: 'fake-jwt-token' };
    const mockUser = { id: '1', name: 'John Doe', roles: ['doctor'] };
  
    let result: boolean | undefined;
  
    service.login('testuser', 'password').then(res => {
      result = res;
    });
  
    // Handle the login request
    const loginReq = httpMock.expectOne('http://localhost:3000/login');
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush(mockResponse);
  
    tick(); // Simulate the passage of time
  
    // Handle the user request
    const userReq = httpMock.expectOne('http://localhost:3000/me');
    expect(userReq.request.method).toBe('GET');
    userReq.flush(mockUser);
  
    tick(); // Simulate the passage of time again
  
    expect(result).toBe(true);
    expect(localStorage.getItem('jwtToken')).toBe('fake-jwt-token');
    expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockUser));
  }));

  it('should handle login failure', fakeAsync(() => {
    let result: boolean | undefined;
  
    service.login('testuser', 'wrongpassword').then(res => {
      result = res;
    });
  
    const req = httpMock.expectOne('http://localhost:3000/login');
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Login failed'));
  
    tick();
  
    expect(result).toBe(false);
  }));

  it('should logout', async () => {
    localStorage.setItem('jwtToken', 'fake-jwt-token');
    localStorage.setItem('currentUser', JSON.stringify({ id: '1', name: 'John Doe' }));

    await service.logout();

    expect(localStorage.getItem('jwtToken')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should get token', () => {
    localStorage.setItem('jwtToken', 'fake-jwt-token');
    expect(service.getToken()).toBe('fake-jwt-token');
  });

  it('should get current user', () => {
    const mockUser = { id: '1', name: 'John Doe', roles: ['doctor'] };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    service['currentUserSubject'].next(mockUser);
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should validate password match', async () => {
    const form = new FormGroup({
      password: new FormControl('password'),
      confirm_password: new FormControl('password')
    });
    const result = await service.passwordMatchValidator(form);
    expect(result).toBeNull();
  });

  it('should validate password mismatch', async () => {
    const form = new FormGroup({
      password: new FormControl('password'),
      confirm_password: new FormControl('different')
    });
    const result = await service.passwordMatchValidator(form);
    expect(result).toEqual({ mismatch: true });
  });

  it('should check username availability', fakeAsync(() => {
    const mockResponse = { available: true, message: 'Username is available' };
  
    let result: any;
  
    service.checkUsername('newuser').then(res => {
      result = res;
    });
  
    const req = httpMock.expectOne('http://localhost:3000/check-username?username=newuser');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  
    tick();
  
    expect(result).toEqual(mockResponse);
  }));

  it('should submit registration', fakeAsync (() => {
    const mockResponse = { success: true };
    const formData = { username: 'newuser', password: 'password' };

    let result: any;

    service.submitRegistration(formData).then(res => {
      result = res;
    });

    const req = httpMock.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    tick();

    expect(result).toEqual(mockResponse);
  }));

  it('should get user name', () => {
    const mockUser = { id: '1', name: 'John Doe', roles: ['doctor'] };
    service['currentUserSubject'].next(mockUser);
    expect(service.getUserName()).toBe('John Doe');
  });

  it('should get user avatar URL', () => {
    const mockUser = { id: '1', name: 'John Doe', roles: ['doctor'], avatar: 'avatar.jpg' };
    service['currentUserSubject'].next(mockUser);
    expect(service.getUserAvatarUrl()).toBe('avatar.jpg');
  });

  it('should return default avatar when user has no avatar', () => {
    const mockUser = { id: '1', name: 'John Doe', roles: ['doctor'] };
    service['currentUserSubject'].next(mockUser);
    expect(service.getUserAvatarUrl()).toBe('assets/anonymous-avatar.png');
  });

  it('should check if user is doctor', () => {
    const mockUser = { id: '1', name: 'John Doe', roles: ['doctor'] };
    service['currentUserSubject'].next(mockUser);
    expect(service.isDoctor()).toBe(true);
  });

  it('should check if user is admin', () => {
    const mockUser = { id: '1', name: 'John Doe', roles: ['admin'] };
    service['currentUserSubject'].next(mockUser);
    expect(service.isAdmin()).toBe(true);
  });

  it('should check if user is pharmacist', () => {
    const mockUser = { id: '1', name: 'John Doe', roles: ['pharmacist'] };
    service['currentUserSubject'].next(mockUser);
    expect(service.isPharmacist()).toBe(true);
  });

  it('should check if user is lab tech', () => {
    const mockUser = { id: '1', name: 'John Doe', roles: ['lab-tech'] };
    service['currentUserSubject'].next(mockUser);
    expect(service.isLabTech()).toBe(true);
  });
});