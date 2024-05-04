import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(prefix: string): Observable<any> {
    const filter = {
      where: {
        phone_number: {
          like: `^${prefix}`
        }
      }
    };

    const httpParams = new HttpParams({
      fromObject: {
        filter: JSON.stringify(filter)
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: httpParams
    };

    return this.http.get<any>('http://localhost:8080/users', httpOptions);
  }

  async saveUser(user: IUser) {
    console.log('Saving user');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };

    const requestBody: any = {
      fname: user.fname,
      lname: user.lname,
      gender: user.gender,
      phone_number: user.phoneNumber,
      address: user.address
    };
    console.log(requestBody);

    return await this.http.post('http://localhost:8080/users', requestBody, httpOptions).toPromise();
  }
}