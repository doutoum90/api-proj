import { Controller, HttpCode, Post, Req, Inject } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import Stripe from 'stripe';

@Controller('stripe-webhook')
export class StripeWebhookController {
  constructor(
    private paymentsService: PaymentsService,
    @Inject('STRIPE') private stripe: Stripe
  ) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(@Req() req) {
    const sig = req.headers['stripe-signature'];
    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.handlePaymentSuccess(event);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancel(event);
        break;
    }
  }

  private async handlePaymentSuccess(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;
    // Logique de gestion du paiement réussi
    console.log(`Payment succeeded for subscription ${invoice.subscription}`);
  }

  private async handleSubscriptionCancel(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;
    // Logique de gestion de l'annulation
    console.log(`Subscription ${subscription.id} was cancelled`);
  }
}   