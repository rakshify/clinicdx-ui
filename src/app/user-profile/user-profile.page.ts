import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/services/auth.service';
import { IUser } from '../core/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.page.html',
  styleUrls: ['user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  user: IUser | null = null;
  contactForm: FormGroup;
  editingContact = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.contactForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser) {
      this.user = await this.userService.getUserDetails(currentUser.id);
      this.contactForm.patchValue({
        phoneNumber: this.user?.phoneNumber,
        email: this.user?.email
      });
    }
  }

  toggleEditContact() {
    this.editingContact = !this.editingContact;
  }

  async saveContactInfo() {
    if (this.contactForm.valid && this.user) {
      const updatedUser = await this.userService.updateUserDetails(this.user.id!, this.contactForm.value);
      if (updatedUser) {
        this.user = updatedUser;
        this.editingContact = false;
      }
    }
  }
}