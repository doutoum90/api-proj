import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfBirth: string;

    @IsString()
    @IsNotEmpty()
    profession: string;

    @IsEnum(['Essentiel', 'PRO', 'Expert'])
    @IsOptional()
    typeAbonnement?: 'Essentiel' | 'PRO' | 'Expert';

    @IsBoolean()
    @IsOptional()
    trialActive?: boolean;
}
  