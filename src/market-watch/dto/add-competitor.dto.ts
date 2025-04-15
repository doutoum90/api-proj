import { IsString, IsUrl, IsArray } from 'class-validator';

export class AddCompetitorDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsUrl()
    domain: string;

    @IsString()
    industry: string;

    @IsArray()
    @IsString({ each: true })
    keywords: string[];
}



