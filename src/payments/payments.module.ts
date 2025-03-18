import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { JwtModule } from '@nestjs/jwt';
import { StripeWebhookController } from './webhooks.controller';

@Module({
  imports: [
    JwtModule,
    ConfigModule
  ],
  controllers: [
    PaymentsController,
    StripeWebhookController
  ],
  providers: [
    PaymentsService,
    {
      provide: 'STRIPE',
      useFactory: (configService: ConfigService) => {
        const secretKey = configService.get<string>('STRIPE_SECRET_KEY');
        if (!secretKey) {
          throw new Error('STRIPE_SECRET_KEY is not defined');
        }
        return new Stripe(secretKey, {
          apiVersion: '2025-02-24.acacia',
          typescript: true,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['STRIPE']
})
export class PaymentsModule { }
