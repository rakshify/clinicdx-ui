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

  async getPatientVisits(patientId: string): Promise<any> {
    const visits: any = [
      {
        "date": "2023-04-15",
        "doctor": "Dr. Emily Wilson",
        "healthComplain": "Persistent headaches and dizziness"
      },
      {
        "date": "2023-05-02",
        "doctor": "Dr. Michael Chen",
        "healthComplain": "Shortness of breath during physical activity"
      },
      {
        "date": "2023-06-10",
        "doctor": "Dr. Sarah Thompson",
        "healthComplain": "Chronic back pain and muscle stiffness"
      },
      {
        "date": "2023-07-20",
        "doctor": "Dr. David Lee",
        "healthComplain": "Recurrent stomach pain and nausea"
      },
      {
        "date": "2023-08-05",
        "doctor": "Dr. Jessica Taylor",
        "healthComplain": "Unexplained weight loss and fatigue"
      },
      {
        "date": "2023-09-12",
        "doctor": "Dr. Robert Brown",
        "healthComplain": "Frequent urination and increased thirst"
      },
      {
        "date": "2023-10-28",
        "doctor": "Dr. Amanda Davis",
        "healthComplain": "Persistent cough and chest congestion"
      },
      {
        "date": "2023-11-18",
        "doctor": "Dr. William Martin",
        "healthComplain": "Joint pain and swelling in multiple areas"
      },
      {
        "date": "2023-12-07",
        "doctor": "Dr. Sophia Rodriguez",
        "healthComplain": "Skin rash and itching"
      },
      {
        "date": "2024-01-25",
        "doctor": "Dr. Andrew Miller",
        "healthComplain": "Difficulty sleeping and feeling anxious"
      }
    ]
    return Promise.resolve(visits);
    // const url = `${this.apiUrl}/get-patient-visits?patientId=${patientId}`;
    // return this.http.get(url).toPromise();
  }

  async bookPatientVisit(visitData: any): Promise<any> {
    console.log("booking visit", visitData);
    return Promise.resolve("visit booked");
    // const url = `${this.apiUrl}/book-patient-visit`;
    // return this.http.post(url, visitData).toPromise();
  }
}