import { IsString, IsUrl, IsArray } from 'class-validator';

export class AddCompetitorDto {
    @IsString()
    name: string;

    @IsUrl()
    domain: string;

    @IsArray()
    @IsString({ each: true })
    keywords: string[];

    @IsString()
    industry: string;
}



