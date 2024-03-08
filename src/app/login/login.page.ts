import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      storeId: ['', Validators.required],
      username: ['', Validators.required],
      pin: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
  }

  login() {
    // Perform any necessary login logic here
    // For now, we'll just navigate to the home page
    this.router.navigate(['/home']);
  }
}