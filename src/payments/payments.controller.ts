import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, CancelPaymentDto, PaymentStatusDto } from './dto/create-payment.dto';

import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.subscribe(userId, createPaymentDto.priceID);
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
}