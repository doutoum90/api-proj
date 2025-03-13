import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitorModule } from 'src/competitor/competitor.module';
import { FinancialModule } from 'src/financial/financial.module';
import { NotificationModule } from 'src/notification/notification.module';
import { SentimentModule } from 'src/sentiment/sentiment.module';
import { ReportService } from './services/report.service';

@Module({
  imports: [
    CompetitorModule,
    FinancialModule,
    SentimentModule,
    NotificationModule,
    TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportsModule { }
