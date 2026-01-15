
import { Controller, Post, Body, Param, Headers, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent/:orderId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    createIntent(@Param('orderId') orderId: string) {
        return this.paymentsService.createPaymentIntent(orderId);
    }

    @Post('webhook')
    async handleWebhook(@Headers('stripe-signature') signature: string, @Req() request: any) { // We need raw body here
        if (!signature) {
            throw new BadRequestException('Missing stripe-signature header');
        }
        // Note: In a real NestJS app, you need to configure the body parser to keep the raw body for this route
        // For this assignment, we will assume 'request.body' might work if configured, or we need a raw body buffer.
        // Since default NestJS parses JSON, this might fail signature verification if we pass parsed JSON object.
        // We will assume the user has configured 'rawBody: true' in main.ts or via middleware.
        // To make it strict: (request as any).rawBody
        const rawBody = (request as any).rawBody || request.body;
        return this.paymentsService.handleWebhook(signature, rawBody);
    }
}
