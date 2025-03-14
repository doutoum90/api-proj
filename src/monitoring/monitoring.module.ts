import { Module } from '@nestjs/common';
import { MonitoringService } from './services/monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competitor } from 'src/financial/entities/competitor.entity';
import { FinancialModule } from 'src/financial/financial.module';
import { NotificationModule } from 'src/notification/notification.module';
import { SentimentModule } from 'src/sentiment/sentiment.module';

@Module({
  imports: [
    FinancialModule,
    SentimentModule,
    NotificationModule,
    TypeOrmModule.forFeature([Competitor])],
  controllers: [MonitoringController],
  providers: [MonitoringService]
})
export class MonitoringModule { }
