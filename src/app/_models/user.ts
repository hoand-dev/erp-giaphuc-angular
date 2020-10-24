export class User {
    id: number;
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    logintime?: Date;
    token?: string;
    access_token?: string;
    refresh_token?: string;
}