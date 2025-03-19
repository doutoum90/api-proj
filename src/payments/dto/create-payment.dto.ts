import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsString()
  @IsNotEmpty()
  priceID: string;

  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  planId: string;
}


export class CancelPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string;
}

export class PaymentStatusDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string;
}