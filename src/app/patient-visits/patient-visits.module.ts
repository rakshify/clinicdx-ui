import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientVisitsPageRoutingModule } from './patient-visits-routing.module';
import { BookVisitModalComponent } from './book-visit/book-visit.component'
import { PatientVisitsPage } from './patient-visits.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientVisitsPageRoutingModule
  ],
  declarations: [PatientVisitsPage, BookVisitModalComponent]
})
export class PatientVisitsPageModule {}
