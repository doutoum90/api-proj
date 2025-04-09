import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { AlertsModule } from './alerts/alerts.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsModule } from './reports/reports.module';
import { SentimentModule } from './sentiment/sentiment.module';
import { FinancialModule } from './financial/financial.module';
import { MarketWatchModule } from './market-watch/market-watch.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ScrapingModule } from './scraping/scraping.module';
import { ApiModule } from './api/api.module';
import { StorageModule } from './storage/storage.module';
import { AnalysisModule } from './analysis/analysis.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5434'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'parametrage',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    ContentModule,
    AlertsModule,
    PaymentsModule,
    ReportsModule,
    SentimentModule,
    FinancialModule,
    MarketWatchModule,
    ScrapingModule,
    ApiModule,
    StorageModule,
    AnalysisModule,
    NotificationsModule,
  ],
})
export class AppModule { }
