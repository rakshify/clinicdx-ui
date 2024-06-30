import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { IUser } from '../interfaces/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user details', async () => {
    const mockUser: IUser = {
      id: '1',
      fname: 'John',
      lname: 'Doe',
      username: 'johndoe',
      gender: 'Male',
      age: 30,
      phoneNumber: '1234567890',
      email: 'john@example.com'
    };

    const userId = '1';

    service.getUserDetails(userId).then(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should return null when user details response is null', async () => {
    const userId = '1';

    service.getUserDetails(userId).then(user => {
      expect(user).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });

  it('should update user details', async () => {
    const mockUser: IUser = {
      id: '1',
      fname: 'John',
      lname: 'Doe',
      username: 'johndoe',
      gender: 'Male',
      age: 30,
      phoneNumber: '1234567890',
      email: 'john@example.com'
    };

    const userId = '1';
    const userDetails: Partial<IUser> = { fname: 'John', lname: 'Doe' };

    service.updateUserDetails(userId, userDetails).then(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/users/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(userDetails);
    req.flush(mockUser);
  });

  it('should get users by prefix', () => {
    const prefix = '123';
    const mockUsers = [{ id: '1', name: 'User 1' }, { id: '2', name: 'User 2' }];

    service.getUsers(prefix).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(request => request.url === 'http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('filter')).toBe(JSON.stringify({
      where: {
        phone_number: {
          like: `^${prefix}`
        }
      }
    }));
    req.flush(mockUsers);
  });

  it('should save user', fakeAsync(() => {
    const mockUser: IUser = {
      fname: 'John',
      lname: 'Doe',
      username: 'johndoe',
      gender: 'Male',
      age: 30,
      phoneNumber: '1234567890',
      email: 'john@example.com'
    };

    const mockResponse = 'User saved successfully';

    let response: any;
    service.saveUser(mockUser).then(res => response = res);

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);

    tick();

    expect(response).toBe(mockResponse);
  }));

  it('should handle error when saving user', fakeAsync(() => {
    const mockUser: IUser = {
      fname: 'John',
      lname: 'Doe',
      username: 'johndoe',
      gender: 'Male',
      age: 30,
      phoneNumber: '1234567890',
      email: 'john@example.com'
    };
  
    let error: any;
    service.saveUser(mockUser).catch(err => error = err);
  
    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Network error'));
  
    tick();
  
    expect(error).toBeTruthy();
    expect(error.message).toContain('Http failure response for http://localhost:3000/users');
  }));
});