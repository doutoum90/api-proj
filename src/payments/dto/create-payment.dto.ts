import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsString()
  @IsNotEmpty()
  priceID: string;
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