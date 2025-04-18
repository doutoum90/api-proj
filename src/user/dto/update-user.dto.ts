import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsEnum(['Essentiel', 'PRO', 'Expert'])
    @IsOptional()
    typeAbonnement?: 'Essentiel' | 'PRO' | 'Expert';

    @IsBoolean()
    @IsOptional()
    trialActive?: boolean;

    @IsString()
    @IsOptional()
    resetToken?: string;

    @IsString()
    @IsOptional()
    stripeCustomerId?: string;
}
