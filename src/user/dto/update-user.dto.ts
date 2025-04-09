import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';

// Utiliser PartialType pour rendre tous les champs de CreateUserDto optionnels
export class UpdateUserDto extends PartialType(CreateUserDto) {
    // Ajouter les champs spécifiques qui peuvent être mis à jour et ne sont pas dans CreateUserDto
    // ou qui ont des règles de validation différentes lors de la mise à jour.

    @IsEnum(['Essentiel', 'PRO', 'Expert'])
    @IsOptional()
    typeAbonnement?: 'Essentiel' | 'PRO' | 'Expert';

    @IsBoolean()
    @IsOptional()
    trialActive?: boolean;

    @IsString()
    @IsOptional()
    resetToken?: string;

    // Ajouter stripeCustomerId comme champ optionnel pour la mise à jour
    @IsString()
    @IsOptional()
    stripeCustomerId?: string;
}
