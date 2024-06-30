import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { LoginPage } from './login.page';
import { AuthService } from '../core/services/auth.service';
import { RegistrationModalComponent } from './registration-modal/registration-modal.component';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const modalSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ModalController, useValue: modalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
    expect(component.loginForm.get('rememberMe')).toBeTruthy();
  });

  it('should call login method when form is valid', async () => {
    authServiceSpy.login.and.returnValue(Promise.resolve(true));
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123',
      rememberMe: false
    });
    await component.login();
    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should set error message when login fails', async () => {
    authServiceSpy.login.and.returnValue(Promise.resolve(false));
    component.loginForm.setValue({
      username: 'testuser',
      password: 'wrongpassword',
      rememberMe: false
    });
    await component.login();
    expect(component.errorMessage).toBe('Invalid response from server');
  });

  it('should set error message when login throws an error', async () => {
    authServiceSpy.login.and.returnValue(Promise.reject('Error'));
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123',
      rememberMe: false
    });
    await component.login();
    expect(component.errorMessage).toBe('Invalid username or password');
  });

  it('should not call login method when form is invalid', async () => {
    component.loginForm.setValue({
      username: '',
      password: '',
      rememberMe: false
    });
    await component.login();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should open registration modal', async () => {
    const modalSpy = jasmine.createSpyObj('Modal', ['present']);
    modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

    await component.openRegistrationModal();

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: RegistrationModalComponent
    });
    expect(modalSpy.present).toHaveBeenCalled();
  });
});