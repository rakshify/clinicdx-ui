// client.services.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'https://your-api-base-url.com'; // Replace with your API base URL

  private specialities: any[] = [
    {
      "id": "1",
      "name": "Medicine",
    },
    {
      "id": "2",
      "name": "Pediatrics",
    },
    {
      "id": "3",
      "name": "Ortho",
    },
    {
      "id": "4",
      "name": "Opthalmology",
    }
  ];
  private doctors: any[] = [
    {
      "id": "1",
      "specialityId": "2",
      "name": "Dr. Emily Wilson",
      "specialty": "Pediatrics"
    },
    {
      "id": "2",
      "specialityId": "3",
      "name": "Dr. Michael Thompson",
      "specialty": "Ortho"
    },
    {
      "id": "3",
      "specialityId": "4",
      "name": "Dr. Sarah Lee",
      "specialty": "Ophthalmology"
    },
    {
      "id": "4",
      "specialityId": "1",
      "name": "Dr. David Chen",
      "specialty": "Medicine"
    },
    {
      "id": "5",
      "specialityId": "2",
      "name": "Dr. Jessica Rodriguez",
      "specialty": "Pediatrics"
    },
    {
      "id": "6",
      "specialityId": "3",
      "name": "Dr. Robert Taylor",
      "specialty": "Ortho"
    },
    {
      "id": "7",
      "specialityId": "4",
      "name": "Dr. Samantha Patel",
      "specialty": "Ophthalmology"
    },
    {
      "id": "8",
      "specialityId": "1",
      "name": "Dr. William Garcia",
      "specialty": "Medicine"
    },
    {
      "id": "9",
      "specialityId": "2",
      "name": "Dr. Sophia Martinez",
      "specialty": "Pediatrics"
    },
    {
      "id": "10",
      "specialityId": "3",
      "name": "Dr. Daniel Nguyen",
      "specialty": "Ortho"
    }
  ]

  constructor(private http: HttpClient) {}

  async getHospitalSpecialities(): Promise<any> {
    // const url = `${this.apiUrl}/get-hospital-specialities`;
    // return this.http.get(url).toPromise();
    return Promise.resolve(this.specialities);
  }

  async getSpecialityDoctors(specialityId: string): Promise<any> {
    // const url = `${this.apiUrl}/get-speciality-doctors?specialityId=${specialityId}`;
    // return this.http.get(url).toPromise();
    console.log("Inside doctor", specialityId);
    console.log("Inside doctor before filter", this.doctors);
    const specialityDoctors = this.doctors.filter(doctor => doctor.specialityId === specialityId);
    console.log("Inside doctor", specialityDoctors);
    return Promise.resolve(specialityDoctors);
  }
}