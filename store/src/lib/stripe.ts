import Stripe from "stripe";
import { DEFAULT_REGION, getCurrencyForRegion, type StoreRegion } from "./pricing";

const FALLBACK_STORE_URL = "http://localhost:3001";

let stripeClient: Stripe | null = null;

export function getStoreUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_STORE_URL;
}

export function getStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to the store environment.");
  }

  return secretKey;
}

export function getStripeClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(getStripeSecretKey());
  }

  return stripeClient;
}

export function getStripeCurrency(region: StoreRegion = DEFAULT_REGION) {
  return getCurrencyForRegion(region).toLowerCase();
}