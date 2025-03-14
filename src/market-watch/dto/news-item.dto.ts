import { ApiProperty } from '@nestjs/swagger';

export class NewsItemDto {
  @ApiProperty({ example: 'Nouvelle innovation en intelligence artificielle' })
  title: string;

  @ApiProperty({ example: 'Une avancée majeure dans le domaine du deep learning...' })
  description: string;

  @ApiProperty({ example: 'https://example.com/article' })
  url: string;

  @ApiProperty({ example: 'Le Monde Techno' })
  source: string;

  @ApiProperty({ type: Date })
  publishedAt: Date;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  imageUrl?: string;

  @ApiProperty({ example: 'technology' })
  category: string;
}