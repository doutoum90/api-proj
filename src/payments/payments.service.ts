import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';


@Injectable()
export class PaymentsService {

  constructor(
    @Inject('STRIPE') private stripe: Stripe,
  ) { }


  async subscribe(customerId: string, priceId: string) {
    const customer = await this.stripe.customers.create({ metadata: { customerId } });
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
    });
    return subscription;
  }

  async cancel(customerId: string) {
    const customer = await this.stripe.customers.search({
      query: `metadata['customerId']:'${customerId}'`,
    });
    if (!customer.data.length) throw new Error('Customer not found');
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customer.data[0].id,
    });
    if (!subscriptions.data.length) throw new Error('No subscription found');
    return this.stripe.subscriptions.cancel(subscriptions.data[0].id);
  }

  async getStatus(customerId: string) {
    const customer = await this.stripe.customers.search({
      query: `metadata['customerId']:'${customerId}'`,
    });
    if (!customer.data.length) return { status: 'no_subscription' };
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customer.data[0].id,
    });
    return { status: subscriptions.data[0]?.status || 'no_subscription' };
  }
}