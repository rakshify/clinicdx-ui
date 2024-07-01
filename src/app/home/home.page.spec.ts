import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { 
  BookAppointmentModalComponent
} from './book-appointment-modal/book-appointment-modal.component';
import { HomePage } from './home.page';

const mockActivatedRoute = {
  snapshot: {},
  queryParams: jasmine.createSpyObj('queryParams', ['subscribe'])
};

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ModalController', ['create']);
  
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: spy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open book appointment modal', async () => {
    const modalSpy = jasmine.createSpyObj('Modal', ['present']);
    modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

    await component.openBookAppointment();

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: BookAppointmentModalComponent,
    });
    expect(modalSpy.present).toHaveBeenCalled();
  });
});