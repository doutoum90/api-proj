import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialModule } from '../financial/financial.module';
import { SentimentModule } from '../sentiment/sentiment.module';
import { ReportService } from './services/report.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    FinancialModule,
    SentimentModule,
    TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportService, JwtService],
  exports: [ReportService],
})
export class ReportsModule { }
