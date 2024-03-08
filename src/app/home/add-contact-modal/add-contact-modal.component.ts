import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.scss']
})
export class AddContactModalComponent {
  phoneNumber: string = "";

  constructor(private modalController: ModalController) {}

  addContact() {
    // Add contact logic here
    console.log('Adding contact with phone number:', this.phoneNumber);

    // Close the modal
    this.modalController.dismiss();
  }
}