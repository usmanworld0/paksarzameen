# Paksarzameen Store Stripe Checkout

## Overview

This implementation replaces the previous WhatsApp-based order completion flow with a real billing page and Stripe Checkout integration for advance card payments.

## Scope

- Billing page at `/checkout`
- Card-only payment flow via Stripe Checkout
- Coupon code application before payment session creation
- Admin-managed coupon creation/editing under `/admin/coupons`
- Success and cancel return pages
- Cart CTA updated to route into billing instead of WhatsApp

## Billing Flow

1. Customer reviews cart and clicks `Proceed to Billing`.
2. Customer enters billing details on `/checkout`.
3. Customer manually enters a coupon code if they have one.
4. Store API validates billing details and coupon on the server.
5. Store creates a Stripe Checkout Session with `payment_method_types: ["card"]`.
6. Customer completes payment on Stripe-hosted checkout.
7. Stripe redirects back to success or cancel page.

## Coupon Model

Coupons are now stored in the database and managed in the admin panel at `/admin/coupons`.

Initial supported coupons:

- `WELCOME10`: 10% off, minimum subtotal PKR 5,000
- `ARTISAN15`: 15% off, minimum subtotal PKR 12,000

## Stripe Configuration

Required environment variables:

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Technical Notes

- Coupon validation is server-backed via Prisma so newly created admin coupons are immediately available without redeploying.
- Checkout no longer exposes selectable coupon suggestions; customers must type coupon codes manually.
- Availability and product pricing already present in cart items are preserved.
- Coupon discounts are translated into Stripe line items by distributing the discount across individual units.
- Store catalog prices remain PKR as the source of truth, while request-time region detection converts storefront, cart, checkout, and Stripe session amounts for Pakistan, the United States, and the United Kingdom.
- Region detection currently uses deployment/request headers first and falls back to language hints, then persists the resolved market in the `psz-region` cookie for client-side consistency.
- Regions are now admin-managed in the database. Admins activate supported markets in `/admin/settings`, and every product must include explicit prices for all active non-default regions.
- Stripe Checkout now uses the region already attached to cart items so the saved regional product price, storefront summary, and payment session all stay aligned.
- The current implementation prepares a working billing and payment path without yet persisting paid orders through a webhook consumer.

## Recommended Next Step

Add a Stripe webhook endpoint to persist successful payments into `Customer`, `Order`, and `OrderItem` tables after checkout completion.