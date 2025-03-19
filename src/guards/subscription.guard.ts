// src/guards/subscription.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionPlan } from '../enums/plan';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPlans = this.reflector.get<SubscriptionPlan[]>(
            'subscription',
            context.getHandler()
        );

        if (!requiredPlans) return true;

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        const user = this.jwtService.verify(token);

        return requiredPlans.includes(user.subscriptionPlan);
    }
}