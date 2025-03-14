export interface UserPayload {
    sub: string;
    email: string;
    type: 'access' | 'refresh';
    iat?: number;
    exp?: number;
}