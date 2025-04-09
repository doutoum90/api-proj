// scraping.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) { }

  @Post()
  async scrape(@Body('url') url: string) {
    return this.scrapingService.scrapeWebsite(url);
  }
}