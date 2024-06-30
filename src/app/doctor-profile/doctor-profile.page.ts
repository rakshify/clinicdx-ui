import { Component, OnInit } from '@angular/core';

import { AppointmentService } from '../core/services/appointment.service';
import { AuthService } from '../core/services/auth.service';
import { IAppointment } from '../core/interfaces/appointment';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: 'doctor-profile.page.html',
  styleUrls: ['doctor-profile.page.scss'],
})
export class DoctorProfilePage implements OnInit {
  appointments: IAppointment[] = [];
  page = 1;
  limit = 10;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  async loadAppointments(event?: any) {
    const user = await this.authService.getCurrentUser();
    if (user) {
      const newAppointments = await this.appointmentService.getDoctorAppointments(
        user.clientId || '',
        user.id,
        this.page,
        this.limit
      );
      this.appointments = [...this.appointments, ...newAppointments];
      this.page++;
      if (event) {
        event.target.complete();
        if (newAppointments.length < this.limit) {
          event.target.disabled = true;
        }
      }
    }
  }
}