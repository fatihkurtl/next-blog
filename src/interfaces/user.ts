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
    email: string;
    password: string;
    remember: boolean;
}

export interface User {
    id: number;
    fullname: string;
    image: string | null;
    username: string;
    email: string;
    date: string;
    token: string;
    expires_at: string;
}

export interface UpdateUserForm {
    fullname: string;
    username: string;
    email: string;
    image: File | null;
}