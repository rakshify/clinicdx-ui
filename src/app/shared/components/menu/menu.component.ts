import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isLoggedIn: boolean = false;
  isDoctor: boolean = false;
  isAdmin: boolean = false;
  isPharmacist: boolean = false;
  isLabTech: boolean = false;
  userName: string = '';
  userAvatarUrl: string = 'assets/images/default-avatars/male.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController
  ) {}

  async ngOnInit() {
    this.authService.isLoggedIn.subscribe(yes => {
      if (yes) {
        this.isLoggedIn = true;
        this.updateUserStatus();
      }
      else {
        this.isLoggedIn = false;
        this.resetVars();
      }
    })
  }

  async resetVars() {
    this.userAvatarUrl = 'assets/images/default-avatars/male.png';
    this.isDoctor = false;
    this.isAdmin = false;
    this.isPharmacist = false;
    this.isLabTech = false;
  }

  async updateUserStatus() {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.isDoctor = this.authService.isDoctor();
        this.isAdmin = this.authService.isAdmin();
        this.isPharmacist = this.authService.isPharmacist();
        this.isLabTech = this.authService.isLabTech();
        this.userName = user.name || '';
        this.userAvatarUrl = user.avatar || 'assets/images/default-avatars/male.png';
      }
    });
  }

  async login() {
    await this.router.navigate(['/login']);
    await this.menuController.close('main-menu');
  }

  async navigateTo(page: string) {
    await this.router.navigate([`/${page}`]);
    await this.menuController.close('main-menu');
  }

  async logout() {
    await this.authService.logout();
    await this.resetVars();
    await this.router.navigate(['/login']);
    await this.menuController.close('main-menu');
  }
}