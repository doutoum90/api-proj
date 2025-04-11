import { Module } from '@nestjs/common';
import { MarketWatchService } from './services/market-watch.service';
import { MarketWatchController } from './controllers/market-watch.controller';
import { Trends } from './entities/trends.entity';
import { HttpModule } from '@nestjs/axios';
import { MarketTrend } from './entities/market-trend.entity';
import { News } from './entities/news.entity';
import { Competitor } from './entities/competitor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrendsController } from './controllers/trends.controller';
import { TrendsService } from './services/trends.service';
import { CompetitorsService } from './services/competitors.service';
import { CompetitorsController } from './controllers/competitors.controller';
import { NewsService } from './services/news.service';
import { NewsController } from './controllers/news.controller';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MarketShare } from './entities/market-share.entity';
import { MarketPrice } from './entities/market-Price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competitor, Trends, News, MarketTrend, MarketShare, MarketPrice, User]), HttpModule],
  controllers: [MarketWatchController, NewsController, CompetitorsController, TrendsController],
  providers: [MarketWatchService, NewsService, CompetitorsService, TrendsService, UserService, JwtService],
  exports: [MarketWatchService, NewsService, CompetitorsService, TrendsService],
})
export class MarketWatchModule { }
