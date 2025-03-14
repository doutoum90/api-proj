import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, {
    provide: 'STRIPE',
    useFactory: (configService: ConfigService) => {
      return new Stripe(configService.get('STRIPE_SECRET_KEY') || '');
    },
    inject: [ConfigService],
  }],
  exports: ['STRIPE']
})
export class PaymentsModule { }
