import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorProfilePageRoutingModule } from './doctor-profile-routing.module';

import { DoctorProfilePage } from './doctor-profile.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [DoctorProfilePage]
})
export class DoctorProfilePageModule {}
