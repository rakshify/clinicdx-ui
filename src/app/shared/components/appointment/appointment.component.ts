import { Component, Input } from '@angular/core';

import { IAppointment } from '../../../core/interfaces/appointment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent {
  @Input() appointment!: IAppointment;

}
