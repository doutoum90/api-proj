import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';


@Injectable()
export class PaymentsService {
  constructor(
    @Inject('STRIPE') private stripe: Stripe,
  ) { }

  async subscribe(createPaymentDto: CreatePaymentDto, userId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: createPaymentDto.amount,
        currency: 'eur',
        payment_method: createPaymentDto.paymentMethodId,
        confirm: true,
        metadata: {
          userId,
          planId: createPaymentDto.planId,
        },
      });

      if (paymentIntent.status === 'succeeded') {
        // Enregistrer en base de données
        return { success: true, id: paymentIntent.id };
      }

      throw new Error('Paiement non confirmé');
    } catch (error) {
      throw new Error(`Erreur Stripe: ${error.message}`);
    }
  }


  async cancelPayment(paymentId: string, userId: string) {
    try {
      // Vérifier que le paiement appartient à l'utilisateur
      const payment = await this.stripe.paymentIntents.retrieve(paymentId);

      if (payment.metadata.userId !== userId) {
        throw new ForbiddenException('Accès non autorisé à ce paiement');
      }

      // Annulation selon le type
      if (payment.status === 'requires_capture') {
        return await this.stripe.paymentIntents.cancel(paymentId);
      }

      // Pour les abonnements
      const subscription = await this.stripe.subscriptions.retrieve(paymentId);
      return await this.stripe.subscriptions.cancel(paymentId);

    } catch (error) {
      throw new Error(`Erreur d'annulation: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentId: string, userId: string) {
    try {
      const payment = await this.stripe.paymentIntents.retrieve(paymentId);

      if (payment.metadata.userId !== userId) {
        throw new ForbiddenException('Accès non autorisé');
      }

      return {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        created: payment.created
      };
    } catch {
      // Si ce n'est pas un payment_intent, vérifier les abonnements
      const subscription = await this.stripe.subscriptions.retrieve(paymentId);
      return {
        id: subscription.id,
        status: subscription.status,
        current_period_end: subscription.current_period_end
      };
    }
  }

  async createSubscription(customerId: string, priceId: string) {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
  }
}

