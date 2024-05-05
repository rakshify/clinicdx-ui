import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientVisitsPage } from './patient-visits.page';

const routes: Routes = [
  {
    path: '',
    component: PatientVisitsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientVisitsPageRoutingModule {}
