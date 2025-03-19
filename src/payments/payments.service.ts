import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject('STRIPE') private stripe: Stripe,
  ) { }

  async subscribe(customerId: string, priceId: string): Promise<Stripe.Subscription> {
    try {
      const customer = await this.stripe.customers.create({
        metadata: { customerId }
      });
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
      });
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to create subscription: ${error.message}`);
      throw new ForbiddenException('Failed to create subscription');
    }
  }

  async cancel(customerId: string): Promise<Stripe.Subscription> {
    try {
      const customer = await this.stripe.customers.search({
        query: `metadata['customerId']:'${customerId}'`,
      });

      if (!customer.data.length) {
        throw new NotFoundException('Customer not found');
      }

      const subscriptions = await this.stripe.subscriptions.list({
        customer: customer.data[0].id,
      });

      if (!subscriptions.data.length) {
        throw new NotFoundException('No subscription found');
      }

      return this.stripe.subscriptions.cancel(subscriptions.data[0].id);
    } catch (error) {
      this.logger.error(`Failed to cancel subscription: ${error.message}`);
      throw error instanceof NotFoundException ? error : new ForbiddenException('Failed to cancel subscription');
    }
  }

  async getStatus(customerId: string): Promise<{ status: string }> {
    try {
      const customer = await this.stripe.customers.search({
        query: `metadata['customerId']:'${customerId}'`,
      });

      if (!customer.data.length) {
        return { status: 'no_subscription' };
      }

      const subscriptions = await this.stripe.subscriptions.list({
        customer: customer.data[0].id,
      });

      return { status: subscriptions.data[0]?.status || 'no_subscription' };
    } catch (error) {
      this.logger.error(`Failed to get subscription status: ${error.message}`);
      throw new ForbiddenException('Failed to get subscription status');
    }
  }
}