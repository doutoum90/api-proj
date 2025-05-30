import { IsOptional, IsString } from 'class-validator';

export class PeriodQueryDto {
    @IsOptional()
    @IsString()
    period?: string;
}