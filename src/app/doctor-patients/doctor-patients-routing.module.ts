import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorPatientsPage } from './doctor-patients.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorPatientsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorPatientsPageRoutingModule {}
