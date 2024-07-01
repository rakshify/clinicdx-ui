import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, MenuController } from '@ionic/angular';
import { of } from 'rxjs';
import { MenuComponent } from './menu.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let menuController: jasmine.SpyObj<MenuController>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'currentUser', 'isDoctor', 'isAdmin', 'isPharmacist', 'isLabTech', 'logout']);
    const menuSpy = jasmine.createSpyObj('MenuController', ['close']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports: [ 
        RouterTestingModule.withRoutes([
          { path: 'login', component: {} as any }
        ]), 
        IonicModule.forRoot() 
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: MenuController, useValue: menuSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    menuController = TestBed.inject(MenuController) as jasmine.SpyObj<MenuController>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    authServiceSpy.isLoggedIn = of(false);
    authServiceSpy.currentUser = of(null);
    
    // Reset the spies before each test
    router.navigate.calls.reset();
    menuController.close.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeFalse();
    expect(component.isDoctor).toBeFalse();
    expect(component.isAdmin).toBeFalse();
    expect(component.isPharmacist).toBeFalse();
    expect(component.isLabTech).toBeFalse();
    expect(component.userName).toBe('');
    expect(component.userAvatarUrl).toBe('assets/images/default-avatars/male.png');
  });

  it('should update user status when logged in', () => {
    authServiceSpy.isLoggedIn = of(true);
    authServiceSpy.currentUser = of({ id: '1', name: 'John Doe', roles: ['doctor'], avatar: 'custom-avatar.png' });
    authServiceSpy.isDoctor.and.returnValue(true);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.isDoctor).toBeTrue();
    expect(component.userName).toBe('John Doe');
    expect(component.userAvatarUrl).toBe('custom-avatar.png');
  });

  it('should reset variables on logout', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    menuController.close.and.returnValue(Promise.resolve(true));
    
    authServiceSpy.logout.and.returnValue(Promise.resolve());
    
    await component.logout();
    
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeFalse();
    expect(component.isDoctor).toBeFalse();
    expect(component.isAdmin).toBeFalse();
    expect(component.isPharmacist).toBeFalse();
    expect(component.isLabTech).toBeFalse();
    expect(component.userAvatarUrl).toBe('assets/images/default-avatars/male.png');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(menuController.close).toHaveBeenCalledWith('main-menu');
  });

  it('should navigate to login page', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    menuController.close.and.returnValue(Promise.resolve(true));

    await component.login();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(menuController.close).toHaveBeenCalledWith('main-menu');
  });

  it('should navigate to a specific page', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    menuController.close.and.returnValue(Promise.resolve(true));

    await component.navigateTo('home');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(menuController.close).toHaveBeenCalledWith('main-menu');
  });
});