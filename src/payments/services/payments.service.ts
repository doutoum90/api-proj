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

  async subscribe(userId: number, priceId: string): Promise<Stripe.Subscription> {
    try {
      if (!priceId || typeof priceId !== 'string' || !priceId.startsWith('price_')) {
        throw new Error('Invalid or missing priceId');
      }

      const user = await this.userService.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      let customerId = user.stripeCustomerId;
      let customer: Stripe.Customer | Stripe.DeletedCustomer;

      if (customerId) {
        customer = await this.stripe.customers.retrieve(customerId);
        if ('deleted' in customer && customer.deleted) {
          customerId = undefined;
        }
      }

      if (!customerId) {
        const newCustomer = await this.stripe.customers.create({
          email: user.email,
          name: `${user.name} ${user.lastname}`,
          metadata: { userId: user.id.toString() },
        });
        customerId = newCustomer.id;
        await this.userService.updateUser(userId, { stripeCustomerId: customerId });
      }

      this.logger.log(`Creating subscription for customer ${customerId} (User ID: ${userId}) with price ${priceId}`);

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await this.userService.updateSubscription(userId, { typeAbonnement: this.getPlanNameFromPriceId(priceId) });
      return subscription;
    } catch (error: any) {
      this.logger.error(`Failed to create subscription for User ID ${userId}: ${error.message}`, error.stack);
      throw new ForbiddenException(`Failed to create subscription: ${error.message}`);
    }
  }

  async upgradeDowngradeSubscription(userId: number, newPriceId: string): Promise<Stripe.Subscription> {
    try {
      const user = await this.userService.findById(userId);
      if (!user || !user.stripeCustomerId) throw new NotFoundException('User or Stripe customer not found');
      const customerId = user.stripeCustomerId;

      const subscriptions = await this.stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 });
      if (!subscriptions.data.length) throw new NotFoundException('No active subscription found');
      const subscription = subscriptions.data[0];

      const updatedSubscription = await this.stripe.subscriptions.update(subscription.id, {
        items: [{ id: subscription.items.data[0].id, price: newPriceId }],
        proration_behavior: 'create_prorations',
        expand: ['latest_invoice.payment_intent'],
      });

      await this.userService.updateSubscription(userId, { typeAbonnement: this.getPlanNameFromPriceId(newPriceId) });
      return updatedSubscription;
    } catch (error: any) {
      this.logger.error(`Failed to update subscription for User ID ${userId}: ${error.message}`, error.stack);
      throw new ForbiddenException(`Failed to update subscription: ${error.message}`);
    }
  }

  async getPaymentHistory(userId: number): Promise<Stripe.Invoice[]> {
    try {
      this.logger.debug(`Tentative de récupération de l'historique des paiements pour l'utilisateur ${userId}`);
      
      const user = await this.userService.findById(userId);
      this.logger.debug('Utilisateur trouvé:', user);
      
      if (!user || !user.stripeCustomerId) {
        this.logger.warn(`Utilisateur non trouvé ou sans stripeCustomerId. User: ${JSON.stringify(user)}`);
        throw new NotFoundException('User or Stripe customer not found');
      }
      
      const customerId = user.stripeCustomerId;
      this.logger.debug(`StripeCustomerId trouvé: ${customerId}`);
      
      const invoices = await this.stripe.invoices.list({ customer: customerId });
      this.logger.debug('Factures trouvées:', invoices);
      
      return invoices.data;
    } catch (error: any) {
      this.logger.error(`Failed to get payment history for User ID ${userId}: ${error.message}`, error.stack);
      throw new ForbiddenException('Failed to get payment history');
    }
  }

  async getNextPayment(userId: number): Promise<{ nextPaymentDate: number; amount: number } | null> {
    try {
      this.logger.debug(`Tentative de récupération du prochain paiement pour l'utilisateur ${userId}`);
      
      const user = await this.userService.findById(userId);
      this.logger.debug('Utilisateur trouvé:', user);
      
      if (!user || !user.stripeCustomerId) {
        this.logger.warn(`Utilisateur non trouvé ou sans stripeCustomerId. User: ${JSON.stringify(user)}`);
        throw new NotFoundException('User or Stripe customer not found');
      }
      
      const customerId = user.stripeCustomerId;
      this.logger.debug(`StripeCustomerId trouvé: ${customerId}`);
      
      const subscriptions = await this.stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 });
      this.logger.debug('Abonnements trouvés:', subscriptions);
      
      if (!subscriptions.data.length) return null;
      const subscription = subscriptions.data[0];
      return {
        nextPaymentDate: subscription.current_period_end,
        amount: subscription.items.data[0].price.unit_amount || 0,
      };
    } catch (error: any) {
      this.logger.error(`Failed to get next payment for User ID ${userId}: ${error.message}`, error.stack);
      throw new ForbiddenException('Failed to get next payment');
    }
  }

  async cancel(userId: number): Promise<Stripe.Subscription> {
    try {
      const user = await this.userService.findById(userId);
      if (!user || !user.stripeCustomerId) throw new NotFoundException('User or Stripe customer not found');
      const customerId = user.stripeCustomerId;

      const subscriptions = await this.stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 });
      if (!subscriptions.data.length) throw new NotFoundException('No active subscription found');

      const cancelledSubscription = await this.stripe.subscriptions.cancel(subscriptions.data[0].id);
      await this.userService.updateSubscription(userId, { typeAbonnement: 'Essentiel' });
      return cancelledSubscription;
    } catch (error: any) {
      this.logger.error(`Failed to cancel subscription for User ID ${userId}: ${error.message}`, error.stack);
      throw error instanceof NotFoundException ? error : new ForbiddenException('Failed to cancel subscription');
    }
  }

  async getStatus(userId: number): Promise<{ status: string }> {
    try {
      const user = await this.userService.findById(userId);
      if (!user || !user.stripeCustomerId) {
        return { status: 'no_customer' };
      }
      const customerId = user.stripeCustomerId;

      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1
      });

      return { status: subscriptions.data[0]?.status || 'no_subscription' };
    } catch (error: any) {
      this.logger.error(`Failed to get subscription status for User ID ${userId}: ${error.message}`);
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