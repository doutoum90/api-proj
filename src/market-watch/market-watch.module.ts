import { Module } from '@nestjs/common';
import { MarketWatchService } from './services/market-watch.service';
import { MarketWatchController } from './market-watch.controller';
import { Trends } from './entities/trends.entity';
import { HttpModule } from '@nestjs/axios';
import { MarketTrend } from './entities/market-trend.entity';
import { News } from './entities/news.entity';
import { Competitor } from './entities/competitor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrendsController } from './trends.controller';
import { TrendsService } from './services/trends.service';
import { CompetitorsService } from './services/competitors.service';
import { CompetitorsController } from './competitors.controller';
import { NewsService } from './services/news.service';
import { NewsController } from './news.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([Competitor, Trends, News, MarketTrend, User]), HttpModule],
  controllers: [MarketWatchController, NewsController, CompetitorsController, TrendsController],
  providers: [MarketWatchService, NewsService, CompetitorsService, TrendsService, UserService, JwtService],
  exports: [MarketWatchService, NewsService, CompetitorsService, TrendsService],
})
export class MarketWatchModule { }
