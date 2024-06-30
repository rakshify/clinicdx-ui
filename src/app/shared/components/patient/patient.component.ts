import { Component, Input } from '@angular/core';

import { IPatient } from '../../../core/interfaces/patient';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent {
  @Input() patient!: IPatient;

}
