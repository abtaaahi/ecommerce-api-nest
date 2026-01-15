
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        private configService: ConfigService,
        private ordersService: OrdersService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2025-12-15.clover', // Use latest or what is installed
        });
    }

    async createPaymentIntent(orderId: string) {
        const order = await this.ordersService.findOne(orderId);
        if (!order) {
            throw new BadRequestException('Order not found');
        }

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(order.totalAmount * 100), // Stripe expects cents
            currency: order.currency,
            metadata: { orderId: order.id },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    }

    async handleWebhook(signature: string, payload: Buffer) {
        const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch (err) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            throw new BadRequestException('Webhook signature verification failed');
        }

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const orderId = paymentIntent.metadata.orderId;
            if (orderId) {
                await this.ordersService.updateStatus(orderId, OrderStatus.COMPLETED, paymentIntent.id);
            }
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const orderId = paymentIntent.metadata.orderId;
            if (orderId) {
                await this.ordersService.updateStatus(orderId, OrderStatus.FAILED, paymentIntent.id);
            }
        }

        return { received: true };
    }
}
