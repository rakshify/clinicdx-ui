import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { BookAppointmentModalComponent } from './book-appointment-modal.component';
import { ClientService } from '../../core/services/client.service';
import { UserService } from '../../core/services/user.service';

describe('BookAppointmentModalComponent', () => {
  let component: BookAppointmentModalComponent;
  let fixture: ComponentFixture<BookAppointmentModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    const clientSpy = jasmine.createSpyObj('ClientService', ['getHospitalSpecialties', 'getSpecialityDoctors']);
    const userSpy = jasmine.createSpyObj('UserService', ['bookPatientVisit']);

    await TestBed.configureTestingModule({
      declarations: [BookAppointmentModalComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalSpy },
        { provide: ClientService, useValue: clientSpy },
        { provide: UserService, useValue: userSpy }
      ]
    }).compileComponents();

    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    clientServiceSpy = TestBed.inject(ClientService) as jasmine.SpyObj<ClientService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture = TestBed.createComponent(BookAppointmentModalComponent);
    component = fixture.componentInstance;
    component.user = { 
      id: '1', 
      fname: 'John', 
      lname: 'Doe', 
      name: 'John Doe',
      username: 'johndoe', 
      gender: 'male', 
      age: 30, 
      phoneNumber: '1234567890', 
      email: 'john@example.com' 
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get hospital specialities on init', async () => {
    const specialities = [{ id: '1', name: 'Cardiology', clientId: 'C1', hospitalId: 'H1' }];
    clientServiceSpy.getHospitalSpecialties.and.returnValue(Promise.resolve(specialities));

    await component.ngOnInit();

    expect(clientServiceSpy.getHospitalSpecialties).toHaveBeenCalled();
    expect(component.specialities).toEqual(specialities);
  });

  it('should handle error when fetching hospital specialities', async () => {
    const error = new Error('API error');
    clientServiceSpy.getHospitalSpecialties.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');

    await component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching hospital specialities:', error);
  });

  it('should get speciality doctors on speciality change', async () => {
    const doctors = [{ id: '1', name: 'Dr. Smith', specialtyId: 'S1', specialty: 'Cardiology', hospitalId: 'H1' }];
    clientServiceSpy.getSpecialityDoctors.and.returnValue(Promise.resolve(doctors));
    component.selectedSpeciality = { id: '1' };

    await component.onSpecialityChange();

    expect(clientServiceSpy.getSpecialityDoctors).toHaveBeenCalledWith('1');
    expect(component.doctors).toEqual(doctors);
  });

  it('should book a visit', async () => {
    component.healthComplain = 'Headache';
    component.selectedDoctor = { id: '1', name: 'Dr. Smith' };
    component.user = { 
      id: '1', 
      fname: 'John', 
      lname: 'Doe', 
      name: 'John Doe',
      username: 'johndoe', 
      gender: 'male', 
      age: 30, 
      phoneNumber: '1234567890', 
      email: 'john@example.com' 
    };
    userServiceSpy.bookPatientVisit.and.returnValue(Promise.resolve());
  
    await component.bookVisit();
  
    expect(userServiceSpy.bookPatientVisit).toHaveBeenCalledWith({
      healthComplain: 'Headache',
      doctorId: '1',
      doctorName: 'Dr. Smith',
      patientId: '1',
      patientName: 'John Doe'
    });
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });

  it('should handle error when booking a visit', async () => {
    const error = new Error('Booking error');
    userServiceSpy.bookPatientVisit.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');
  
    component.healthComplain = 'Headache';
    component.selectedDoctor = { id: '1', name: 'Dr. Smith' };
  
    await component.bookVisit();
  
    expect(console.error).toHaveBeenCalledWith('Error booking patient visit:', error);
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
  });

  it('should cancel booking', () => {
    component.cancelBooking();
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });
});