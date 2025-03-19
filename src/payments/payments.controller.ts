import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, CancelPaymentDto, PaymentStatusDto } from './dto/create-payment.dto';

import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  FRONT_URL = 'http://localhost:5173'
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    const userId = (req as any).user['sub'];
    try {
      return await this.paymentsService.subscribe(userId, createPaymentDto.priceID);
    } catch (error) {
      console.error('Subscribe error:', error.message);
      throw error;
    }
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async cancelPayment(@Body() cancelPaymentDto: CancelPaymentDto, @Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.cancel(userId);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getPaymentStatus(@Body() paymentStatusDto: PaymentStatusDto, @Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.getStatus(userId);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(@Req() req, @Body() body: { plan: 'Essentiel' | 'PRO' | 'Expert' }) {
    const stripe = require('stripe')('your_stripe_secret_key');
    const priceMap = { Essentiel: 2900, PRO: 5900, Expert: 9900 }; // En centimes

    const session = await stripe.checkout.sessions.create({
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
      metadata: { userId: req.user.sub },
    });

    return { sessionId: session.id };
  }
}