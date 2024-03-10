import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  firstName: string = "";
  lastName: string = "";
  gender: string = "";
  address: string = "";
  phoneNumber: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.phoneNumber = params['phoneNumber'];
    });
  }

  saveUser() {
    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      address: this.address,
      phoneNumber: this.phoneNumber,
    };

    // Save user data logic here
    console.log('Saving user:', user);

    // Navigate back to home page and pass the user data
    this.router.navigate(['/home'], { state: { user: user } });
  }
}