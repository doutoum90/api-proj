import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { UserService } from '../../user/user.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject('STRIPE') private stripe: Stripe,
    private readonly userService: UserService
  ) { }

  async subscribe(customerId: string, priceId: string): Promise<Stripe.Subscription> {
    try {
      if (!priceId || typeof priceId !== 'string' || !priceId.startsWith('price_')) {
        throw new Error('Invalid or missing priceId');
      }
      const customer = await this.stripe.customers.create({ metadata: { customerId } });
      this.logger.log(`Creating subscription for customer ${customer.id} with price ${priceId}`);
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
      });
      await this.userService.updateSubscription(parseInt(customerId), { typeAbonnement: this.getPlanNameFromPriceId(priceId) });
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to create subscription: ${error.message}`, error.stack);
      throw new ForbiddenException(`Failed to create subscription: ${error.message}`);
    }
  }
  async upgradeDowngradeSubscription(customerId: string, newPriceId: string): Promise<Stripe.Subscription> {
    try {
      const customer = await this.stripe.customers.search({ query: `metadata['customerId']:'${customerId}'` });
      if (!customer.data.length) throw new NotFoundException('Customer not found');

      const subscriptions = await this.stripe.subscriptions.list({ customer: customer.data[0].id });
      if (!subscriptions.data.length) throw new NotFoundException('No active subscription found');

      const subscription = subscriptions.data[0];
      const updatedSubscription = await this.stripe.subscriptions.update(subscription.id, {
        items: [{ id: subscription.items.data[0].id, price: newPriceId }],
        proration_behavior: 'create_prorations', // Ajuste les coûts au prorata
      });

      await this.userService.updateSubscription(parseInt(customerId), { typeAbonnement: this.getPlanNameFromPriceId(newPriceId) });
      return updatedSubscription;
    } catch (error) {
      this.logger.error(`Failed to update subscription: ${error.message}`, error.stack);
      throw new ForbiddenException(`Failed to update subscription: ${error.message}`);
    }
  }

  async getPaymentHistory(customerId: string): Promise<Stripe.Invoice[]> {
    try {
      const customer = await this.stripe.customers.search({ query: `metadata['customerId']:'${customerId}'` });
      if (!customer.data.length) throw new NotFoundException('Customer not found');

      const invoices = await this.stripe.invoices.list({ customer: customer.data[0].id });
      return invoices.data;
    } catch (error) {
      this.logger.error(`Failed to get payment history: ${error.message}`, error.stack);
      throw new ForbiddenException('Failed to get payment history');
    }
  }

  async getNextPayment(customerId: string): Promise<{ nextPaymentDate: number; amount: number } | null> {
    try {
      const customer = await this.stripe.customers.search({ query: `metadata['customerId']:'${customerId}'` });
      if (!customer.data.length) throw new NotFoundException('Customer not found');

      const subscriptions = await this.stripe.subscriptions.list({ customer: customer.data[0].id });
      if (!subscriptions.data.length) return null;

      const subscription = subscriptions.data[0];
      return {
        nextPaymentDate: subscription.current_period_end,
        amount: subscription.items.data[0].price.unit_amount || 0,
      };
    } catch (error) {
      this.logger.error(`Failed to get next payment: ${error.message}`, error.stack);
      throw new ForbiddenException('Failed to get next payment');
    }
  }

  async cancel(customerId: string): Promise<Stripe.Subscription> {
    try {
      const customer = await this.stripe.customers.search({ query: `metadata['customerId']:'${customerId}'` });
      if (!customer.data.length) throw new NotFoundException('Customer not found');

      const subscriptions = await this.stripe.subscriptions.list({ customer: customer.data[0].id });
      if (!subscriptions.data.length) throw new NotFoundException('No subscription found');

      const cancelledSubscription = await this.stripe.subscriptions.cancel(subscriptions.data[0].id);
      await this.userService.updateSubscription(parseInt(customerId), { typeAbonnement: 'Essentiel' }); // Par défaut après annulation
      return cancelledSubscription;
    } catch (error) {
      this.logger.error(`Failed to cancel subscription: ${error.message}`, error.stack);
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

  private getPlanNameFromPriceId(priceId: string): 'Essentiel' | 'PRO' | 'Expert' {
    const priceMap = {
      'price_1R4NK1QMk6qRSmo1egY1hfsD': 'Essentiel',
      'price_1R4NJCQMk6qRSmo112OpuuEU': 'PRO',
      'price_1R4NKMQMk6qRSmo1CObfbfsU': 'Expert',
    };
    return priceMap[priceId] || 'Essentiel'; 
  }
}