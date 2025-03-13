import { Module } from '@nestjs/common';
import { NewsService } from './services/news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competitor } from './entities/competitor.entity';
import { Trends } from './entities/trends.entity';
import { News } from './entities/news.entity';
import { MarketTrend } from './entities/market-trend.entity';
import { CompetitorsService } from './services/competitors.service';
import { TrendsService } from './services/trends.service';
import { CompetitorsController } from './competitors.controller';
import { TrendsController } from './trends.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Competitor, Trends, News, MarketTrend]), HttpModule],
  controllers: [NewsController, CompetitorsController, TrendsController],
  providers: [NewsService, CompetitorsService, TrendsService],
  exports: [NewsService, CompetitorsService, TrendsService],
})
export class VeilleModule { }
