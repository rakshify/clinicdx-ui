import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
import { IAppointment } from '../interfaces/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  async getDoctorAppointments(clientId: string, doctorId: string, page: number, limit: number): Promise<IAppointment[]> {
    const url = `${this.apiUrl}/appointments?clientId=${clientId}&doctorId=${doctorId}&_page=${page}&_limit=${limit}`;
    const response = await this.http.get<IAppointment[]>(url).toPromise();
    return response ?? [];
  }
}