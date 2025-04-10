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
import { AppDataSource } from './data-source';
import { Logger } from '@nestjs/common';

const logger = new Logger('AppModule');

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
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        logger.log(`DATABASE_URL dans useFactory: ${process.env.DATABASE_URL || 'non défini'}`);
        return {
          ...AppDataSource.options,
          autoLoadEntities: true,
        };
      },
      dataSourceFactory: async () => {
        logger.log('Initialisation de TypeORM...');
        await AppDataSource.initialize();
        logger.log('TypeORM initialisé');
        return AppDataSource;
      },
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
export class AppModule {
  constructor() {
    logger.log(`DATABASE_URL dans AppModule: ${process.env.DATABASE_URL || 'non défini'}`);
  }
}
