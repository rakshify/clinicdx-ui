import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { 
  BookAppointmentModalComponent 
} from './book-appointment-modal/book-appointment-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private modalController: ModalController
  ) {}

  async ngOnInit() {}

  async openBookAppointment() {
    const modal = await this.modalController.create({
      component: BookAppointmentModalComponent,
    });
    return await modal.present();
  }
}