import { Module } from '@nestjs/common';
import { SentimentService } from './services/sentiment.service';
import { SentimentController } from './sentiment.controller';
import { Competitor } from '../financial/entities/competitor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterService } from './services/twitter.service';
import { RedditService } from './services/reddit.service';
import { SentimentAnalyzer } from './services/sentiment-analyzer';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Competitor]), HttpModule],
  controllers: [SentimentController],
  providers: [SentimentService, TwitterService, RedditService, SentimentAnalyzer],
  exports: [SentimentService],
})
export class SentimentModule { }
