import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Alert } from './alerts/entities/alert.entity';
import { Regulation } from './alerts/entities/regulation.entity';
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
import { Competitor } from './market-watch/entities/competitor.entity';
import { Financial } from './financial/entities/financial.entity';
import { Monitoring } from './monitoring/entities/monitoring.entity';
import { Notification } from './notification/entities/notification.entity';
import { Payment } from './payments/entities/payment.entity';
import { Report } from './reports/entities/report.entity';
import { Sentiment } from './sentiment/entities/sentiment.entity';
import { Setting } from './settings/entities/setting.entity';

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
