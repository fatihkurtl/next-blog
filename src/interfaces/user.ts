export interface UserRegister {
    fullname: string;
    username: string;
    email: string;
    image: File | null;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface User {
    id: number;
    fullName: string;
    username: string;
    image: string | null;
    email: string;
    password: string;
    date: string;
}