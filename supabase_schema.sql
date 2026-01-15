-- Enable UUID extension (Supabase usually has this, but good to ensure)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" character varying NOT NULL,
    "password" character varying NOT NULL,
    "fullName" character varying,
    "role" character varying NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_user_email" UNIQUE ("email")
);

-- 2. Products Table
CREATE TABLE "product" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "description" text,
    "price" numeric(10, 2) NOT NULL,
    "currency" character varying NOT NULL DEFAULT 'usd',
    "stock" integer NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_product_id" PRIMARY KEY ("id")
);

-- 3. Orders Table
CREATE TABLE "order" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "status" character varying NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
    "totalAmount" numeric(10, 2) NOT NULL,
    "currency" character varying NOT NULL DEFAULT 'usd',
    "items" jsonb,
    "stripePaymentIntentId" character varying,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "userId" UUID,
    CONSTRAINT "PK_order_id" PRIMARY KEY ("id"),
    CONSTRAINT "FK_order_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
