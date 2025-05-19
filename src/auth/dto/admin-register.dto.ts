import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class AdminRegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    adminKey: string; // Clé secrète pour valider l'inscription admin
} 