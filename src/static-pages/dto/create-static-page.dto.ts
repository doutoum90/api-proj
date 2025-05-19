import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateStaticPageDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 