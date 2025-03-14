import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, CancelPaymentDto, PaymentStatusDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }


  @Post('subscribe')
  @UseGuards(AuthGuard('jwt'))
  async subscribe(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user['sub'] // Adapté à votre structure JWT
    return this.paymentsService.subscribe(createPaymentDto, userId);
  }


  @Post('cancel')
  @UseGuards(AuthGuard('jwt'))
  async cancelPayment(
    @Body() cancelPaymentDto: CancelPaymentDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.cancelPayment(
      cancelPaymentDto.paymentId,
      userId
    );
  }

  @Post('status')
  @UseGuards(AuthGuard('jwt'))
  async getPaymentStatus(
    @Body() paymentStatusDto: PaymentStatusDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user['sub'];
    return this.paymentsService.getPaymentStatus(
      paymentStatusDto.paymentId,
      userId
    );
  }

}
