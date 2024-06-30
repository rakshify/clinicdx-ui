import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IPatient } from '../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  async getDoctorPatients(clientId: string, doctorId: string, page: number, limit: number): Promise<IPatient[]> {
    const url = `${this.apiUrl}/patients?clientId=${clientId}&doctorId=${doctorId}&_page=${page}&_limit=${limit}`;
    const response = await this.http.get<IPatient[]>(url).toPromise();
    return response ?? [];
  }
}