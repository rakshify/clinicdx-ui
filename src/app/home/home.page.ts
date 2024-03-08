import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddContactModalComponent } from './add-contact-modal/add-contact-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private modalController: ModalController) {}

  async openAddModal() {
    const modal = await this.modalController.create({
      component: AddContactModalComponent,
    });
    await modal.present();
  }

}