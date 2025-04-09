import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @MinLength(8, { message: 'New password must be at least 8 characters long' })
    @IsNotEmpty()
    newPassword: string;
}
