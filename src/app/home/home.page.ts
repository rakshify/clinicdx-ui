import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { BookAppointmentModalComponent } from './book-appointment-modal/book-appointment-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // isLoggedIn: boolean = false;
  // isDoctor: boolean = false;
  // isAdmin: boolean = false;
  // isPharmacist: boolean = false;
  // isLabTech: boolean = false;
  // userName: string = '';
  userAvatarUrl: string = 'assets/anonymous-avatar.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    // await this.updateUserStatus();
  }

  // async updateUserStatus() {
  //   this.isLoggedIn = await this.authService.isLoggedIn();
  //   if (this.isLoggedIn) {
  //     const user = await this.authService.getCurrentUser();
  //     if (user !== undefined && user !== null) {
  //       this.isDoctor = this.authService.isDoctor();
  //       this.isAdmin = this.authService.isAdmin();
  //       this.isPharmacist = this.authService.isPharmacist();
  //       this.isLabTech = this.authService.isLabTech();
  //       this.userName = user.name || '';
  //       this.userAvatarUrl = user.avatar || 'assets/default-avatar.png';
  //     }
  //   } else {
  //     this.userAvatarUrl = 'assets/default-avatar.png';
  //   }
  // }

  // login() {
  //   this.router.navigate(['/login']);
  // }

  // async logout() {
  //   await this.authService.logout();
  //   this.updateUserStatus();
  //   this.router.navigate(['/login']);
  // }

  // navigateTo(page: string) {
  //   this.router.navigate([`/${page}`]);
  // }

  async openBookAppointment() {
    const modal = await this.modalController.create({
      component: BookAppointmentModalComponent,
    });
    return await modal.present();
  }
}