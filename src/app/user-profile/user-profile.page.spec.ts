import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserProfilePage } from './user-profile.page';
import { AuthService } from '../core/services/auth.service';
import { UserService } from '../core/services/user.service';
import { IUser, IUserProfile } from '../core/interfaces/user';

describe('UserProfilePage', () => {
  let component: UserProfilePage;
  let fixture: ComponentFixture<UserProfilePage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser: IUser = {
    id: '1',
    fname: 'John',
    lname: 'Doe',
    username: 'johndoe',
    gender: 'male',
    age: 30,
    phoneNumber: '1234567890',
    email: 'john@example.com',
    roles: ['user']
  };

  const mockUserProfile: IUserProfile = {
    id: '1',
    name: 'John Doe',
    roles: ['user']
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const userSpy = jasmine.createSpyObj('UserService', ['getUserDetails', 'updateUserDetails']);

    await TestBed.configureTestingModule({
      declarations: [ UserProfilePage ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: UserService, useValue: userSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the contact form', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.get('phoneNumber')).toBeTruthy();
    expect(component.contactForm.get('email')).toBeTruthy();
  });

  it('should load user details on init', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUserProfile);
    userServiceSpy.getUserDetails.and.returnValue(Promise.resolve(mockUser));
  
    component.ngOnInit();
    tick();
  
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(userServiceSpy.getUserDetails).toHaveBeenCalledWith(mockUserProfile.id);
    expect(component.user).toEqual(mockUser);
    expect(component.contactForm.get('phoneNumber')?.value).toBe(mockUser.phoneNumber);
    expect(component.contactForm.get('email')?.value).toBe(mockUser.email);
  }));
  
  it('should not load user details if getCurrentUser returns null', fakeAsync(() => {
    authServiceSpy.getCurrentUser.and.returnValue(null);
  
    component.ngOnInit();
    tick();
  
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(userServiceSpy.getUserDetails).not.toHaveBeenCalled();
    expect(component.user).toBeNull();
  }));

  it('should toggle editing contact', () => {
    expect(component.editingContact).toBeFalse();
    component.toggleEditContact();
    expect(component.editingContact).toBeTrue();
    component.toggleEditContact();
    expect(component.editingContact).toBeFalse();
  });

  it('should save contact info when form is valid', fakeAsync(() => {
    component.user = mockUser;
    component.contactForm.setValue({
      phoneNumber: '9876543210',
      email: 'newemail@example.com'
    });
    const updatedUser = { ...mockUser, phoneNumber: '9876543210', email: 'newemail@example.com' };
    userServiceSpy.updateUserDetails.and.returnValue(Promise.resolve(updatedUser));

    component.saveContactInfo();
    tick();

    expect(userServiceSpy.updateUserDetails).toHaveBeenCalledWith(mockUser.id!, {
      phoneNumber: '9876543210',
      email: 'newemail@example.com'
    });
    expect(component.user).toEqual(updatedUser);
    expect(component.editingContact).toBeFalse();
  }));

  it('should not save contact info when form is invalid', fakeAsync(() => {
    component.user = mockUser;
    component.editingContact = true;  // Set initial state to true
    component.contactForm.setValue({
      phoneNumber: 'invalid',
      email: 'invalid'
    });
  
    component.saveContactInfo();
    tick();
  
    expect(userServiceSpy.updateUserDetails).not.toHaveBeenCalled();
    expect(component.editingContact).toBeTrue();  // Should still be true
  }));

  it('should not save contact info when user is null', fakeAsync(() => {
    component.user = null;
    component.contactForm.setValue({
      phoneNumber: '9876543210',
      email: 'newemail@example.com'
    });

    component.saveContactInfo();
    tick();

    expect(userServiceSpy.updateUserDetails).not.toHaveBeenCalled();
  }));

  it('should handle update failure', fakeAsync(() => {
    component.user = mockUser;
    component.editingContact = true;  // Set initial state to true
    component.contactForm.setValue({
      phoneNumber: '9876543210',
      email: 'newemail@example.com'
    });
    userServiceSpy.updateUserDetails.and.returnValue(Promise.resolve(null));
  
    component.saveContactInfo();
    tick();
  
    expect(userServiceSpy.updateUserDetails).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser); // user should not be updated
    expect(component.editingContact).toBeTrue(); // should still be in edit mode
  }));
});