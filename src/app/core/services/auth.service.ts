import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {IUserProfile} from '../interfaces/user'

// interface IUserProfile {
//   id: string;
//   name: string;
//   username: string;
//   avatar?: string;
//   isDoctor: boolean;
//   isAdmin: boolean;
//   isPharmacist: boolean;
//   isLabTech: boolean;
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedInSubject.asObservable();

  private apiUrl = 'http://localhost:3000';
  private currentUserSubject: BehaviorSubject<IUserProfile | null>;
  currentUser: Observable<IUserProfile | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUserProfile | null>(
      this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): IUserProfile | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      );
      if (response && response.token) {
        localStorage.setItem('jwtToken', response.token);
        this.loggedInSubject.next(true);
        const user = await firstValueFrom(
          this.http.get<any>(`${this.apiUrl}/me`)
        );
        localStorage.setItem('currentUser', user ? JSON.stringify(user) : '');
        this.currentUserSubject.next(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // isLoggedIn(): boolean {
  //   const token = this.getToken();
  //   console.log(`token: ${token}`);
  //   return !!token;
  // }

  getCurrentUser(): IUserProfile | null {
    return this.currentUserSubject.value;
  }

  async passwordMatchValidator(g: FormGroup): Promise<{ [key: string]: boolean } | null> {
    return g.get('password')?.value === g.get('confirm_password')?.value
      ? null : { 'mismatch': true };
  }

  async checkUsername(username: string): Promise<{available: boolean, message: string}> {
    try {
      return await firstValueFrom(
        this.http.get<{available: boolean, message: string}>(
          `${this.apiUrl}/check-username?username=${username}`)
      );
    } catch (error) {
      console.error('Error checking username:', error);
      throw error;
    }
  }

  async submitRegistration(formData: any): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.post(`${this.apiUrl}/signup`, formData)
      );
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  getUserName(): string {
    const user = this.getCurrentUser();
    return user?.name || '';
  }

  getUserAvatarUrl(): string {
    const user = this.getCurrentUser();
    return user && user.avatar ? user.avatar : 'assets/anonymous-avatar.png';
  }

  isDoctor(): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes('doctor') : false;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes('admin') : false;
  }

  isPharmacist(): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes('pharmacist') : false;
  }

  isLabTech(): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes('lab-tech') : false;
  }

  // async updateUserProfile(userData: Partial<IUserProfile>): Promise<IUserProfile> {
  //   try {
  //     const updatedUser = await firstValueFrom(
  //       this.http.put<IUserProfile>(`${this.apiUrl}/user-profile`, userData)
  //     );
  //     const currentUser = await this.getCurrentUser();
  //     if (currentUser) {
  //       const newUser = { ...currentUser, ...updatedUser };
  //       localStorage.setItem('currentUser', JSON.stringify(newUser));
  //       this.currentUserSubject.next(newUser);
  //     }
  //     return updatedUser;
  //   } catch (error) {
  //     console.error('Error updating user profile:', error);
  //     throw error;
  //   }
  // }
}