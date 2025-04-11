import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import Stripe from 'stripe';

@Controller('api/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  FRONT_URL = 'http://localhost:5173';
  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject('STRIPE') private stripe: Stripe,
  ) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    const userId = (req as any).user['sub'];
    const subscription = await this.paymentsService.subscribe(userId, createPaymentDto.priceID);
    if (createPaymentDto.paymentMethodId) {
      await this.stripe.paymentMethods.attach(createPaymentDto.paymentMethodId, { customer: subscription.customer as string });
      await this.stripe.subscriptions.update(subscription.id, { default_payment_method: createPaymentDto.paymentMethodId });
    }
    return { subscriptionId: subscription.id, status: subscription.status };
  }

  @Post('upgrade-downgrade')
  @HttpCode(HttpStatus.OK)
  async upgradeDowngrade(@Body('newPriceId') newPriceId: string, @Req() req: Request) {
    const userId = (req as any).user['sub'];
    const subscription = await this.paymentsService.upgradeDowngradeSubscription(userId, newPriceId);
    return { subscriptionId: subscription.id, status: subscription.status };
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  async getPaymentHistory(@Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.getPaymentHistory(userId);
  }

  @Get('next-payment')
  @HttpCode(HttpStatus.OK)
  async getNextPayment(@Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.getNextPayment(userId);
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async cancelPayment(@Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.cancel(userId);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getPaymentStatus(@Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.getStatus(userId);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(@Req() req: Request, @Body() body: { plan: 'Essentiel' | 'PRO' | 'Expert' }) {
    const priceMap = { Essentiel: 2900, PRO: 5900, Expert: 9900 }; // En centimes

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: body.plan },
          unit_amount: priceMap[body.plan],
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${this.FRONT_URL}/success`,
      cancel_url: `${this.FRONT_URL}/cancel`,
      metadata: { userId: (req as any).user['sub'] },
    });

    return { sessionId: session.id };
  }
}