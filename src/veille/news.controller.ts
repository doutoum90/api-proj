import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsService } from './services/news.service';
import { NewsItemDto } from './dto/news-item.dto';

@ApiTags('Veille')
@Controller('api/veille')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('news')
  @ApiOperation({ summary: 'Récupère les dernières actualités sectorielles' })
  @ApiQuery({ name: 'sector', required: false, description: 'Secteur industriel' })
  @ApiQuery({ name: 'lang', required: false, description: 'Langue des résultats (fr/en)' })
  @ApiResponse({ status: 200, type: [NewsItemDto] })
  async getSectorNews(
    @Query('sector') sector = 'technology',
    @Query('lang') lang = 'fr'
  ): Promise<NewsItemDto[]> {
    return this.newsService.getAggregatedNews(sector, lang);
  }
}