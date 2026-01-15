
# Ecommerce API

Backend API for an ecommerce system built with NestJS, PostgreSQL, and Stripe.

## Features

- **Authentication**: JWT based authentication (Register/Login).
- **Users**: Profile management.
- **Products**: Create and list products.
- **Orders**: Create orders (with cart calculation) and track status (PENDING, COMPLETED, FAILED).
- **Payments**: Stripe integration for PaymentIntents and Webhooks.
- **Documentation**: Swagger UI.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the values:
   - Postgres credentials.
   - Stripe keys (Secret Key and Webhook Secret).
   - JWT Secret.

3. **Database**
   Ensure PostgreSQL is running and the database matches `DATABASE_NAME`.
   Tables will be auto-created (`synchronize: true` is enabled for dev).

4. **Run**
   ```bash
   npm run start:dev
   ```

## Documentation

- **Swagger UI**: Visit `http://localhost:3000/api` to see all endpoints and test them.

## Payment Flow

1. **Create Order**: User sends `POST /orders` with items.
2. **Payment Intent**: Frontend calls `POST /payments/create-intent/:orderId` to get a Stripe Client Secret.
3. **Checkout**: Frontend uses Stripe Elements to confirm payment with the Client Secret.
4. **Webhook**: Stripe sends `payment_intent.succeeded` event to `POST /payments/webhook`. Backend updates Order status to `COMPLETED`.