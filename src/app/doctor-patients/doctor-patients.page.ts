import { Component, OnInit } from '@angular/core';

import { PatientService } from '../core/services/patient.service';
import { AuthService } from '../core/services/auth.service';
import { IPatient } from '../core/interfaces/patient';

@Component({
  selector: 'app-doctor-patients',
  templateUrl: 'doctor-patients.page.html',
  styleUrls: ['doctor-patients.page.scss'],
})
export class DoctorPatientsPage implements OnInit {
  patients: IPatient[] = [];
  page = 1;
  limit = 10;

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  async loadPatients(event?: any) {
    const user = await this.authService.getCurrentUser();
    if (user) {
      const newPatients = await this.patientService.getDoctorPatients(
        user.clientId || '',
        user.id,
        this.page,
        this.limit
      );
      this.patients = [...this.patients, ...newPatients];
      this.page++;
      if (event) {
        event.target.complete();
        if (newPatients.length < this.limit) {
          event.target.disabled = true;
        }
      }
    }
  }
}