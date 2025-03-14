import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, CancelPaymentDto, PaymentStatusDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('subscribe')
  async subscribe(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    const userId = (req as any).user['sub']
    return this.paymentsService.subscribe(userId, createPaymentDto.priceID);
  }

  @Post('cancel')
  async cancelPayment(@Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.cancel(userId);
  }

  @Post('status')
  async getPaymentStatus(@Req() req: Request) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.getStatus(userId);
  }
}