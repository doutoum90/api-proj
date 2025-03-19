import { User } from "../../user/entities/user.entity";

export interface LoginResponseDto {
    access_token: string;
    refresh_token: string;
    user: User;
}