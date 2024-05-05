import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.scss'],
})
export class AddContactModalComponent {
  phoneNumber: string = "";
  searchResults: any[] = [];

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private router: Router
  ) {}

  searchUsers() {
    if (this.phoneNumber.length >= 3) {
      this.userService.getUsers(this.phoneNumber).subscribe(
        users => {
          this.searchResults = users;
        },
        error => {
          console.error(error);
        }
      );;
    } else {
      this.searchResults = [];
    }
  }

  navigateToHome(user: any) {
    this.router.navigate(['/patient-visits'], { state: { user: user } });
    this.modalController.dismiss();
  }

  navigateToUserProfile() {
    if (this.phoneNumber.length === 10) {
      this.router.navigate(['/user-profile', { phoneNumber: this.phoneNumber }]);
      this.modalController.dismiss();
    } else {
      // Show an error message or perform validation
      console.log('Phone number should be 10 digits');
    }
  }
}