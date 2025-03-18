import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialModule } from 'src/financial/financial.module';
import { NotificationModule } from 'src/notification/notification.module';
import { SentimentModule } from 'src/sentiment/sentiment.module';
import { ReportService } from './services/report.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    FinancialModule,
    SentimentModule,
    NotificationModule,
    TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportService,  JwtService],
  exports: [ReportService],
})
export class ReportsModule { }
