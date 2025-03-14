import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { AlertsModule } from './alerts/alerts.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsModule } from './reports/reports.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { SentimentModule } from './sentiment/sentiment.module';
import { FinancialModule } from './financial/financial.module';
import { NotificationModule } from './notification/notification.module';
import { MarketWatchModule } from './market-watch/market-watch.module';
import { SettingsModule } from './settings/settings.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Chemin explicite
      validationOptions: {
        allowUnknown: false, // Validation stricte
        abortEarly: true
      }
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
      entities: [User],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    AuthModule,
    ContentModule,
    AlertsModule,
    PaymentsModule,
    ReportsModule,
    MonitoringModule,
    SentimentModule,
    FinancialModule,
    NotificationModule,
    MarketWatchModule,
    SettingsModule,
  ],
})
export class AppModule { }
