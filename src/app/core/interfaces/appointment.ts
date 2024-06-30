export interface IAppointment {
    id?: string;
    patientId: string;
    patientName: string;
    gender: string;
    age: number;
    phoneNumber: string;
    complain: string;
    referDoctor?: string;
    referDoctorName?: string;
    referDoctorSpeciality?: string;
    consultDoctor: string;
    consultDoctorName: string;
    consultDoctorSpeciality: string;
    clientId?: string;
    aptType: string;
    aptAt: string;
}
