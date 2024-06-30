// book-visit.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientService } from '../../core/services/client.service';
import { UserService } from '../../core/services/user.service';
import { IUser } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-book-visit',
  templateUrl: './book-appointment-modal.component.html',
  styleUrls: ['./book-appointment-modal.component.scss'],
})
export class BookAppointmentModalComponent implements OnInit {
  @Input() user!: IUser;
  healthComplain?: string;
  specialities: any[] = [];
  selectedSpeciality: any;
  doctors: any[] = [];
  selectedDoctor: any;

  constructor(
    private modalController: ModalController,
    private clientService: ClientService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getHospitalSpecialities();
  }

  async getHospitalSpecialities() {
    // this.specialities = await this.clientService.getHospitalSpecialities();
    // console.log(this.specialities);
    try {
      this.specialities = await this.clientService.getHospitalSpecialities();
      console.log(this.specialities);
    } catch (error) {
      console.error('Error fetching hospital specialities:', error);
      // Handle the error appropriately
    }
    // this.clientService.getHospitalSpecialities().subscribe(
    //   (specialities) => {
    //     this.specialities = specialities;
    //   },
    //   (error) => {
    //     console.error('Error fetching hospital specialities:', error);
    //   }
    // );
  }

  async onSpecialityChange() {
    console.log(this.selectedSpeciality.id);
    console.log(this.selectedSpeciality);
    this.doctors = await this.clientService.getSpecialityDoctors(
      this.selectedSpeciality.id);
    // this.clientService.getSpecialityDoctors(this.selectedSpeciality.id).subscribe(
    //   (doctors) => {
    //     this.doctors = doctors;
    //   },
    //   (error) => {
    //     console.error('Error fetching doctors for speciality:', error);
    //   }
    // );
  }

  async bookVisit() {
    const visitData = {
      healthComplain: this.healthComplain,
      doctorId: this.selectedDoctor.id,
      doctorName: this.selectedDoctor.name,
      patientId: this.user.id,
      patientName: this.user.name
    };

    try {
      await this.userService.bookPatientVisit(visitData);
      // Close the modal and navigate back to the home page
      this.modalController.dismiss();
      // Add any additional logic for navigation here
    } catch (error) {
      console.error('Error booking patient visit:', error);
    }
  }

  cancelBooking() {
    this.modalController.dismiss();
  }
}