import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

import { AuthService } from '../core/services/auth.service';
import { 
  RegistrationModalComponent 
} from './registration-modal/registration-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController,
    private location: Location
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
  }

  async login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      await this.authService.login(username, password)
      .then(
        success => {
          if (success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid response from server';
          }
        }
      ).catch(
        error => {
          this.errorMessage = 'Invalid username or password';
        }
      );
    }
  }

  async openRegistrationModal() {
    const modal = await this.modalController.create({
      component: RegistrationModalComponent
    });
    return await modal.present();
  }
}