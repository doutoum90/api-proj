import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  priceID: string;
}


export class CancelPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string; // ID Stripe (payment_intent ou subscription)
}

export class PaymentStatusDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string;
}