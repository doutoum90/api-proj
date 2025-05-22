import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
    @IsJWT()
    @IsNotEmpty()
    refresh_token: string;
}