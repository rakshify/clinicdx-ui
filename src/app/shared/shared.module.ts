import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AppointmentComponent } from './components/appointment/appointment.component';
import { PatientComponent } from './components/patient/patient.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [MenuComponent, AppointmentComponent, PatientComponent],
  imports: [CommonModule, IonicModule],
  exports: [MenuComponent, AppointmentComponent, PatientComponent]
})
export class SharedModule { }