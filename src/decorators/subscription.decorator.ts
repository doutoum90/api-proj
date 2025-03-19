// src/decorators/subscription.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { SubscriptionPlan } from '../enums/plan';

export const SUBSCRIPTION_KEY = 'subscription';
export const RequiresSubscription = (...plans: SubscriptionPlan[]) =>
    SetMetadata(SUBSCRIPTION_KEY, plans);