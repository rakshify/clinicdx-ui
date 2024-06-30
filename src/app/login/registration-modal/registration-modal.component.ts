import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.scss'],
})
export class RegistrationModalComponent implements OnInit {
  registrationForm: FormGroup;
  currentTab = 1;
  usernameAvailable: boolean | null = null;
  usernameMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private authService: AuthService
  ) {
    this.registrationForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      gender: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.registrationForm.get('username')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((username: string) => this.checkUsername(username));
      // .subscribe(username => {
      //   if (username && username.length >= 3) {
      //     this.checkUsername(username);
      //   } else {
      //     this.usernameAvailable = null;
      //     this.usernameMessage = '';
      //   }
      // });
  }

  ngOnInit() {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirm_password')?.value
      ? null : { 'mismatch': true };
  }

  async checkUsername(username: string) {
    try {
      const response = await this.authService.checkUsername(username);
      this.usernameAvailable = response.available;
      this.usernameMessage = response.message;
    } catch (error) {
      console.error('Error checking username:', error);
      this.usernameAvailable = null;
      this.usernameMessage = 'Error checking username availability';
    }
  }

  nextTab() {
    this.currentTab = 2;
  }

  previousTab() {
    this.currentTab = 1;
  }

  async submitRegistration() {
    if (this.registrationForm.valid) {
      try {
        const response = await this.authService.submitRegistration(
          this.registrationForm.value);
        console.log('Registration successful', response);
        this.modalController.dismiss({ registered: true });
      } catch (error) {
        console.error('Registration error', error);
        // Handle error (e.g., show error message)
      }
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}