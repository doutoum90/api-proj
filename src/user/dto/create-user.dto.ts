import { IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    email: string;
    name: string;
    password: string;
    typeAbonnement: 'Essentiel' | 'PRO' | 'Expert';
    trialActive: boolean;
    trialStartDate: Date;
    @IsEnum(UserRole)
    role?: UserRole;
}
