export interface IUser {
    id?: string;
    fname: string;
    lname: string;
    name?: string;
    username: string;
    gender: string;
    age: number;
    phoneNumber: string;
    email: string;
    address?: string;
    avatar?: string;
    roles?: string[];
    // isDoctor: boolean;
    // isAdmin: boolean;
    // isPharmacist: boolean;
    // isLabTech: boolean;
}

export interface IUserProfile {
    id: string;
    name: string;
    clientId?: string;
    roles: string[];
    avatar?: string;
}