import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddCompetitorKPIDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;

    @IsString()
    @IsOptional()
    source?: string;
} 