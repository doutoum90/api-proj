import { Controller, HttpCode, Post, Req } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

@Controller('stripe-webhook')
export class StripeWebhookController {
/* constructor(private paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(@Req() req) {
    const sig = req.headers['stripe-signature'];
    const event = this.paymentsService.constructEvent(req.rawBody, sig);

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.handlePaymentSuccess(event);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancel(event);
        break;
        }
  } */
}   