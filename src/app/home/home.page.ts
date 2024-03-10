import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { Router, ActivatedRoute, NavigationEnd, NavigationTransition } from '@angular/router';
import { Router, NavigationStart } from '@angular/router';
// import { Router, ActivatedRoute } from '@angular/router';
// import { filter } from 'rxjs/operators';

import { AddContactModalComponent } from './add-contact-modal/add-contact-modal.component';
// import { IUserParam } from '../core/interfaces/user-param'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  users: any[] = [];

  constructor(
    private modalController: ModalController,
    private router: Router,
    // private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.route.data.subscribe(data => {
    //   console.log(data['state']);
    //   // const user = JSON.parse(params['user']);
    // });
    this.router.events
      // .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        // console.log(event);
        if (event instanceof NavigationStart) {
          const extras = this.router.getCurrentNavigation()?.extras;
          if (extras?.state) {
            const user = extras.state['user'];
            if (user) {
              this.users.push(user);
            }
          }
        }
      });
  }

  async openAddModal() {
    const modal = await this.modalController.create({
      component: AddContactModalComponent,
    });
    await modal.present();
  }
}