import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { DataSourceType } from '../entities/competitor-data-source.entity';

export class AddCompetitorDataSourceDto {
    @IsEnum(DataSourceType)
    type: DataSourceType;

    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsOptional()
    description?: string;
} 