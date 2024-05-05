// patient-visits.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
// import * as path from 'path';

import { BookVisitModalComponent } from './book-visit/book-visit.component';
import { UserService } from '../core/services/user.service';
import { IUser } from '../core/interfaces/user';

@Component({
  selector: 'app-patient-visits',
  templateUrl: './patient-visits.page.html',
  styleUrls: ['./patient-visits.page.scss'],
})
export class PatientVisitsPage implements OnInit {
  user!: IUser;
  patientVisits: any[] = [];

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    // Get user data from state
    // if (this.router.getCurrentNavigation()?.extras.state === undefined) {
    //   return;
    // }
    this.user = this.router.getCurrentNavigation()?.extras.state?.['user'];
    this.user.name = `${this.user.fname?.trim() || ''} ${this.user.lname?.trim() || ''}`.trim();
    if (this.user.avatar === undefined) {
      this.user.avatar = `assets/images/default-avatars/${this.user.gender}.png`;
    }
    console.log("Received user", this.user);
  }

  async ionViewWillEnter() {
    if (this.user === undefined) {
      console.error('Error fetching patient visits:');
      return;
    }
    try {
      // Fetch all previous visits of the patient
      const visits = await this.userService.getPatientVisits(this.user.phoneNumber);
      this.patientVisits = visits;
    } catch (error) {
      console.error('Error fetching patient visits:', error);
    }
  }

  async openBookVisitModal() {
    const modal = await this.modalController.create({
      component: BookVisitModalComponent,
      componentProps: {
        user: this.user
      }
    });
    modal.present();
  }
}