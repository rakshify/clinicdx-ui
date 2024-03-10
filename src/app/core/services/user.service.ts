import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = [
    {
      fname: 'John',
      lname: 'Doe',
      gender: 'male',
      phoneNumber: '1234567890',
      address: '123 Main St'
    },
    {
      fname: 'Jane',
      lname: 'Smith',
      gender: 'female',
      phoneNumber: '0987654321',
      address: '456 Oak Ave'
    },
    {
      fname: 'Bob',
      lname: 'Johnson',
      gender: 'male',
      phoneNumber: '5551234567',
      address: '789 Elm Rd'
    },
    {
      fname: 'Sarah',
      lname: 'Williams',
      gender: 'female',
      phoneNumber: '2345678901',
      address: '321 Pine St'
    },
    {
      fname: 'Mike',
      lname: 'Brown',
      gender: 'male',
      phoneNumber: '6789012345',
      address: '159 Maple Ln'
    }
  ];

  getUsers(prefix: string): any[] {
    return this.users.filter(user => user.phoneNumber.startsWith(prefix));
  }
}